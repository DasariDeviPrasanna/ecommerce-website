// Google Apps Script for handling reviews API
// This script should be deployed as a web app in Google Apps Script

function doPost(e) {
  try {
    console.log('Received POST request');
    console.log('Raw postData:', e.postData);
    
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    const action = data.action;
    
    switch(action) {
      case 'submitReview':
        return submitReview(data);
      case 'getReviews':
        return getReviews(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid action: ' + action
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Server error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    console.log('Received GET request');
    console.log('Parameters:', e.parameter);
    
    const action = e.parameter.action;
    const productId = e.parameter.productId;
    
    switch(action) {
      case 'getReviews':
        return getReviews({ productId: productId });
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid action: ' + action
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Server error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function submitReview(data) {
  try {
    console.log('Submitting review:', data);
    
    const { productId, userId, username, rating, reviewText } = data;
    
    // Validate required fields
    if (!productId || !userId || !username || !rating || !reviewText) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Reviews');
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      console.log('Creating Reviews sheet');
      sheet = spreadsheet.insertSheet('Reviews');
      sheet.getRange(1, 1, 1, 7).setValues([['ID', 'Product ID', 'User ID', 'Username', 'Rating', 'Review Text', 'Created At']]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
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
    
    console.log('Adding row:', newRow);
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Review submitted successfully',
      reviewId: newRow[0]
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in submitReview:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Error submitting review: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getReviews(data) {
  try {
    console.log('Getting reviews:', data);
    
    const { productId } = data;
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Reviews');
    
    if (!sheet) {
      console.log('No Reviews sheet found');
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
    
    console.log('Found reviews:', filteredReviews.length);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      reviews: filteredReviews
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in getReviews:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Error getting reviews: ' + error.toString()
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
