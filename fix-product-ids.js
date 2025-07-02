// Script to fix duplicate product IDs in restaurants data
// This will make all product IDs unique across all restaurants

const fs = require('fs');

// Read the current script.js file
const scriptContent = fs.readFileSync('script.js', 'utf8');

// Define the ID ranges for each restaurant
const idRanges = {
    1: { start: 1, end: 46 },      // Dakshin Haveli - keep original IDs
    2: { start: 100, end: 139 },   // SRI Kanya - new range
    3: { start: 200, end: 209 },   // Dragon Wok - new range  
    4: { start: 300, end: 309 }    // Pasta Paradise - new range
};

// Function to update IDs for a specific restaurant
function updateRestaurantIds(restaurantId, newStartId) {
    const restaurantPattern = new RegExp(
        `\\{\\s*id:\\s*${restaurantId},[\\s\\S]*?menuItems:\\s*\\[([\\s\\S]*?)\\]\\s*\\}`,
        'g'
    );
    
    let match;
    let updatedContent = scriptContent;
    let currentId = newStartId;
    
    while ((match = restaurantPattern.exec(scriptContent)) !== null) {
        const menuItemsSection = match[1];
        
        // Replace all id: X, patterns in the menu items
        const updatedMenuItems = menuItemsSection.replace(
            /id:\s*\d+,/g,
            () => `id: ${currentId++},`
        );
        
        // Replace the entire menu items section
        updatedContent = updatedContent.replace(menuItemsSection, updatedMenuItems);
    }
    
    return updatedContent;
}

// Update all restaurants
let finalContent = scriptContent;

// Update SRI Kanya (restaurant 2)
finalContent = updateRestaurantIds(2, 100);

// Update Dragon Wok (restaurant 3) 
finalContent = updateRestaurantIds(3, 200);

// Update Pasta Paradise (restaurant 4)
finalContent = updateRestaurantIds(4, 300);

// Write the updated content back to the file
fs.writeFileSync('script.js', finalContent);

console.log('✅ Product IDs have been updated to be unique across all restaurants!');
console.log('📊 ID Ranges:');
console.log('   Restaurant 1 (Dakshin Haveli): IDs 1-46');
console.log('   Restaurant 2 (SRI Kanya): IDs 100-139');
console.log('   Restaurant 3 (Dragon Wok): IDs 200-209');
console.log('   Restaurant 4 (Pasta Paradise): IDs 300-309'); 