# Google Sheets Setup Guide

This guide explains how to set up Google Sheets integration for the admin dashboard.

## Overview

The admin dashboard can sync product data with Google Sheets in both directions:
- **Import from Sheets**: Update database products from Google Sheets data
- **Export to Sheets**: Push current database products and orders to Google Sheets

## Prerequisites

- Google Cloud Platform account
- Google Sheets spreadsheet

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API** for your project

### 2. Create Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Give it a name (e.g., "plushie-app-sheets")
4. Grant it the **Editor** role (or custom role with Sheets access)
5. Click **Create Key** and download the JSON file
6. Keep this file secure - it contains your credentials

### 3. Prepare Google Sheets

Create a new Google Sheets spreadsheet with two sheets:

#### Products Sheet

Column structure (A-G):
- **A**: ID (number)
- **B**: Name (text)
- **C**: Description (text)
- **D**: Price (number, e.g., 24.99)
- **E**: Image URL (text)
- **F**: Stock Quantity (number)
- **G**: Status (text: "active" or "inactive")

Header row example:
```
ID | Name | Description | Price | Image URL | Stock Quantity | Status
```

#### Orders Sheet

The Orders sheet will be automatically populated when you export orders from the admin dashboard.

### 4. Share Spreadsheet with Service Account

1. Open your Google Sheets spreadsheet
2. Click **Share** button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it **Editor** permissions
5. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 5. Configure Environment Variables

1. Open your `.env` file
2. Update the following variables:

```bash
# Google Sheets Service Account
# Paste the entire JSON content from your service account key file
# Make sure it's valid JSON on a single line (or use single quotes to preserve formatting)
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}'

# Spreadsheet ID from the URL
GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id-here"

# Admin key for accessing admin dashboard
ADMIN_KEY="your-secure-random-key-here"
```

To generate a secure admin key:
```bash
openssl rand -base64 32
```

### 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/login`

3. Enter your admin key (from `ADMIN_KEY` in `.env`)

4. Go to the admin dashboard and try:
   - **Import from Sheets**: Syncs data from Google Sheets to your database
   - **Export to Sheets**: Pushes database data to Google Sheets

## API Endpoints

The following admin API endpoints are available:

### Sync Products from Google Sheets
```bash
POST /api/admin/sync-sheets
Headers: x-admin-key: YOUR_ADMIN_KEY
```

### Export Products to Google Sheets
```bash
PUT /api/admin/sync-sheets
Headers: x-admin-key: YOUR_ADMIN_KEY
```

### Export Orders to Google Sheets
```bash
POST /api/admin/orders
Headers: x-admin-key: YOUR_ADMIN_KEY
```

## Security Notes

1. **Never commit credentials**: The `.env` file is gitignored. Never commit it to version control.

2. **Secure admin key**: Use a strong, randomly generated admin key. Change it regularly.

3. **Service account permissions**: Only grant the service account access to the specific spreadsheet, not all your Google Drive files.

4. **HTTPS in production**: Always use HTTPS in production to protect the admin key during transmission.

## Troubleshooting

### "Failed to sync from Google Sheets"
- Verify the service account JSON is properly formatted
- Check that the spreadsheet ID is correct
- Ensure the service account has Editor access to the spreadsheet
- Verify the sheet names are exactly "Products" and "Orders"

### "Unauthorized" error
- Make sure your admin key in the request matches the `ADMIN_KEY` in `.env`
- Restart your dev server after changing `.env` variables

### Data not syncing
- Check that your Products sheet has the correct column structure (A-G)
- Verify that ID, Name, and Price columns have valid data
- Check the browser console for detailed error messages

## Example Product Data

Here's sample data you can add to your Products sheet:

```
ID | Name | Description | Price | Image URL | Stock Quantity | Status
1 | Baby Blue Penguin | Adorable kawaii penguin | 24.99 | /cute-baby-blue-penguin-plushie-kawaii.jpg | 15 | active
2 | Pink Bunny | Soft and cuddly pink bunny | 29.99 | /pink-bunny-plushie.jpg | 20 | active
```

## Benefits

- **Easy inventory management**: Update prices and stock in Google Sheets
- **Team collaboration**: Multiple team members can manage products in Sheets
- **Backup and audit**: Keep a copy of your product data in Sheets
- **Order tracking**: Export orders to Sheets for reporting and analysis
