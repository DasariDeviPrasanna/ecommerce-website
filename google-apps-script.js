// Google Apps Script for handling reviews API
// This script should be deployed as a web app in Google Apps Script

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'submitReview':
        return submitReview(data);
      case 'getReviews':
        return getReviews(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid action'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const productId = e.parameter.productId;
    
    switch(action) {
      case 'getReviews':
        return getReviews({ productId: productId });
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid action'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function submitReview(data) {
  try {
    const { productId, userId, username, rating, reviewText } = data;
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Reviews');
      newSheet.getRange(1, 1, 1, 6).setValues([['ID', 'Product ID', 'User ID', 'Username', 'Rating', 'Review Text', 'Created At']]);
      newSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    const reviewsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
    
    // Add the new review
    const newRow = [
      Date.now(), // ID
      productId,
      userId,
      username,
      rating,
      reviewText,
      new Date().toISOString()
    ];
    
    reviewsSheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Review submitted successfully',
      reviewId: newRow[0]
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getReviews(data) {
  try {
    const { productId } = data;
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        reviews: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Skip header row
    const reviews = values.slice(1).map(row => ({
      id: row[0],
      productId: row[1],
      userId: row[2],
      username: row[3],
      rating: row[4],
      reviewText: row[5],
      created_at: row[6]
    }));
    
    // Filter by productId if provided
    const filteredReviews = productId ? 
      reviews.filter(review => review.productId == productId) : 
      reviews;
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      reviews: filteredReviews
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// CORS handling
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
