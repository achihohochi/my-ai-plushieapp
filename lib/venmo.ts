import QRCode from 'qrcode';

/**
 * Generate Venmo payment deep link
 * Format: https://venmo.com/u/USERNAME (works with both personal and business)
 * Alternative format: venmo://paycharge?txn=pay&recipients=USERNAME&amount=TOTAL&note=ORDER_NUMBER
 */
export function generateVenmoLink({
  username,
  amount,
  note,
}: {
  username: string;
  amount: number;
  note: string;
}): string {
  // Try web-based Venmo link which works with personal accounts
  // User will need to enter amount and note manually, but it opens in browser/app
  return `https://venmo.com/${username}?txn=pay&amount=${amount.toFixed(2)}&note=${encodeURIComponent(note)}`;
}

/**
 * Generate QR code as data URL for Venmo payment
 */
export async function generateVenmoQRCode({
  username,
  amount,
  note,
}: {
  username: string;
  amount: number;
  note: string;
}): Promise<string> {
  const venmoLink = generateVenmoLink({ username, amount, note });

  // Generate QR code as data URL (can be used directly in <img src="">)
  const qrCodeDataUrl = await QRCode.toDataURL(venmoLink, {
    width: 300,
    margin: 2,
    color: {
      dark: '#008CFF', // Venmo blue
      light: '#FFFFFF',
    },
  });

  return qrCodeDataUrl;
}

/**
 * Get configured Venmo username from environment
 */
export function getVenmoUsername(): string | null {
  return process.env.VENMO_USERNAME || null;
}
