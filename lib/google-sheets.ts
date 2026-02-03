import { google } from 'googleapis';

// Initialize Google Sheets API
export function getGoogleSheetsClient() {
  // Use service account credentials
  const auth = new google.auth.GoogleAuth({
    credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
      : undefined,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Get spreadsheet ID from environment
export function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not set in environment variables');
  }
  return spreadsheetId;
}

// Sync products from Google Sheets to database
export async function syncProductsFromSheets(prisma: any) {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Read data from the "Products" sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Products!A2:G', // Skip header row, columns A-G
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { success: true, message: 'No products found in sheet', synced: 0 };
    }

    let syncedCount = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const [id, name, description, price, imageUrl, stockQuantity, status] = row;

        // Skip rows with missing critical data
        if (!id || !name || !price) continue;

        // Update or create product
        await prisma.product.upsert({
          where: { id: parseInt(id) },
          update: {
            name,
            description: description || null,
            price: parseFloat(price),
            image_url: imageUrl || '',
            stock_quantity: parseInt(stockQuantity) || 0,
            status: status || 'active',
          },
          create: {
            id: parseInt(id),
            name,
            description: description || null,
            price: parseFloat(price),
            image_url: imageUrl || '',
            stock_quantity: parseInt(stockQuantity) || 0,
            status: status || 'active',
          },
        });

        syncedCount++;
      } catch (error) {
        errors.push(`Error syncing product ${row[0]}: ${error}`);
      }
    }

    return {
      success: true,
      message: `Successfully synced ${syncedCount} products`,
      synced: syncedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error syncing from Google Sheets:', error);
    throw new Error(`Failed to sync from Google Sheets: ${error}`);
  }
}

// Export products from database to Google Sheets
export async function exportProductsToSheets(prisma: any) {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Fetch all products from database
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });

    // Prepare data for sheets (header + rows)
    const values = [
      ['ID', 'Name', 'Description', 'Price', 'Image URL', 'Stock Quantity', 'Status'],
      ...products.map((p: any) => [
        p.id,
        p.name,
        p.description || '',
        p.price.toString(),
        p.image_url,
        p.stock_quantity,
        p.status,
      ]),
    ];

    // Update the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Products!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return {
      success: true,
      message: `Successfully exported ${products.length} products to Google Sheets`,
      exported: products.length,
    };
  } catch (error) {
    console.error('Error exporting to Google Sheets:', error);
    throw new Error(`Failed to export to Google Sheets: ${error}`);
  }
}

// Export orders to Google Sheets
export async function exportOrdersToSheets(prisma: any) {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Fetch all orders from database
    const orders = await prisma.order.findMany({
      include: {
        order_items: {
          include: { product: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Prepare data for sheets
    const values = [
      [
        'Order Number',
        'Customer Name',
        'Customer Email',
        'Total',
        'Status',
        'Payment Status',
        'Created At',
        'Items',
      ],
      ...orders.map((order: any) => [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.total.toString(),
        order.order_status,
        order.payment_status,
        order.created_at.toISOString(),
        order.order_items
          .map((item: any) => `${item.product.name} (${item.quantity})`)
          .join(', '),
      ]),
    ];

    // Update or create the Orders sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Orders!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return {
      success: true,
      message: `Successfully exported ${orders.length} orders to Google Sheets`,
      exported: orders.length,
    };
  } catch (error) {
    console.error('Error exporting orders to Google Sheets:', error);
    throw new Error(`Failed to export orders to Google Sheets: ${error}`);
  }
}
