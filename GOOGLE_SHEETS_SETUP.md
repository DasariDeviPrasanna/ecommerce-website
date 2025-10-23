# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for storing reviews in your ecommerce website.

## Prerequisites

- A Google account
- Access to Google Apps Script
- A Google Sheets document

## Step 1: Create a Google Sheets Document

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Ecommerce Reviews" or any name you prefer
4. Note the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script.js` from this project
4. Save the project with a name like "Ecommerce Reviews API"

## Step 3: Deploy as Web App

1. In your Google Apps Script project, click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set the following options:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the web app URL that's generated

## Step 4: Update Your Website

1. Open `script.js` in your project
2. Find the line: `const GOOGLE_SHEETS_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';`
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with your actual web app URL from Step 3

## Step 5: Test the Integration

1. Open your website
2. Login to your account
3. Navigate to any restaurant and click on a menu item
4. Submit a review
5. Check your Google Sheets document - you should see the review data appear in a new "Reviews" sheet

## How It Works

- When a user submits a review, the system first tries to save it to Google Sheets
- If Google Sheets is unavailable, it falls back to localStorage
- Reviews are loaded from Google Sheets first, with localStorage as a fallback
- The Google Sheets will automatically create a "Reviews" sheet with columns:
  - ID (timestamp)
  - Product ID
  - User ID
  - Username
  - Rating (1-5)
  - Review Text
  - Created At

## Troubleshooting

### Reviews not appearing in Google Sheets
- Check that the web app URL is correct
- Ensure the Google Apps Script is deployed as a web app with "Anyone" access
- Check the browser console for any error messages

### CORS errors
- Make sure your Google Apps Script includes the CORS headers (already included in the provided code)

### Permission errors
- Ensure the Google Apps Script has permission to access Google Sheets
- You may need to authorize the script when first running it

## Security Notes

- The current setup allows anyone to submit reviews
- For production use, consider adding authentication to your Google Apps Script
- You may want to implement rate limiting to prevent spam

## Data Structure

The Google Sheets will contain the following columns:
- **ID**: Unique identifier (timestamp)
- **Product ID**: ID of the menu item being reviewed
- **User ID**: ID of the user who submitted the review
- **Username**: Name of the user who submitted the review
- **Rating**: Star rating (1-5)
- **Review Text**: The actual review content
- **Created At**: Timestamp when the review was submitted
