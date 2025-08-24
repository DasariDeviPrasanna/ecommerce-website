// Global function to open login modal
function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Function to close login modal
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make functions globally available
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;

// Function to check login status and update UI (moved to global scope)
function checkLoginStatusAndUpdateUI() {
    const mainContent = document.querySelector('.main-content');
    const loginRequired = document.getElementById('loginRequired');
    
    if (!isLoggedIn || !currentUser) {
        console.log('User not logged in, showing login required screen');
        // Show login required screen and hide main content
        if (loginRequired) loginRequired.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
        return false;
    } else {
        console.log('User is logged in, showing main content');
        // Hide login required screen and show main content
        if (loginRequired) loginRequired.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        return true;
    }
}

// Initialize login functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Initializing Login System ===');
    
    // Get the login button
    const loginBtn = document.getElementById('loginRequiredBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeLogin');
    
    // Add click event to login button
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Login button clicked');
            openLoginModal();
        });
        console.log('✅ Login button event listener added');
    } else {
        console.error('❌ Login button not found');
    }
    
    // Add click event to close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeLoginModal();
        });
        console.log('✅ Close button event listener added');
    }
    
    // Close modal when clicking outside
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
        console.log('✅ Modal outside click handler added');
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
            closeLoginModal();
        }
    });
    
    // Add login form event listeners
    const emailLoginForm = document.getElementById('emailLoginForm');
    const phoneLoginForm = document.getElementById('phoneLoginForm');
    const sendOtpBtn = document.querySelector('.send-otp');
    
    console.log('🔍 Checking form elements:');
    console.log('📧 Email form found:', !!emailLoginForm);
    console.log('📱 Phone form found:', !!phoneLoginForm);
    console.log('📤 Send OTP button found:', !!sendOtpBtn);
    
    if (emailLoginForm) {
        console.log('📧 Email form HTML:', emailLoginForm.outerHTML);
        const emailInput = emailLoginForm.querySelector('input[type="email"]');
        const passwordInput = emailLoginForm.querySelector('input[type="password"]');
        console.log('📧 Email input found:', !!emailInput);
        console.log('🔑 Password input found:', !!passwordInput);
    }
    
    // Email Login Form
    if (emailLoginForm) {
        console.log('✅ Email login form found, adding event listener');
        emailLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📧 Email login form submitted');
            
            const email = emailLoginForm.querySelector('input[type="email"]').value.trim();
            const password = emailLoginForm.querySelector('input[type="password"]').value.trim();
            
            console.log('📧 Email entered:', `"${email}"`);
            console.log('🔑 Password entered:', `"${password}"`);
            
            if (!email || !password) {
                showNotification('Please enter both email and password');
                return;
            }
            
            // Check credentials against localStorage userData
            const user = JSON.parse(localStorage.getItem('userData') || '{}');
            if (user && user.email === email && user.password === password) {
                currentUser = user;
                isLoggedIn = true;
                updateLoginState();
                checkLoginStatusAndUpdateUI();
                showNotification('Login successful!');
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                displayRestaurants();
                initializeFeatures();
                emailLoginForm.reset();
            } else {
                showNotification('Invalid email or password');
                emailLoginForm.querySelector('input[type="password"]').value = '';
            }
        });
    } else {
        console.error('❌ Email login form not found');
    }
    
    // Phone Login Form
    if (phoneLoginForm) {
        console.log('✅ Phone login form found, adding event listener');
        phoneLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📱 Phone login form submitted');
            
            const phone = this.querySelector('input[type="tel"]').value;
            const otp = this.querySelector('input[type="text"]').value;
            
            console.log('Phone:', phone);
            console.log('OTP:', otp);
            
            // Check credentials
            if (phone === '9701690259') {
                console.log('✅ Phone login successful');
                handleSuccessfulLogin();
                
                // Clear the form
                this.reset();
            } else {
                console.log('❌ Phone login failed');
                showNotification('Invalid phone number');
                this.querySelector('input[type="text"]').value = '';
            }
        });
    } else {
        console.error('❌ Phone login form not found');
    }
    
    // Send OTP Button
    if (sendOtpBtn) {
        console.log('✅ Send OTP button found, adding event listener');
        sendOtpBtn.addEventListener('click', function() {
            console.log('📤 Send OTP button clicked');
            const phoneInput = phoneLoginForm.querySelector('input[type="tel"]');
            const otpInput = phoneLoginForm.querySelector('input[type="text"]');
            
            if (phoneInput.value === '9701690259') {
                showNotification('OTP sent successfully!');
                otpInput.disabled = false;
                otpInput.focus();
            } else {
                showNotification('Invalid phone number');
            }
        });
    } else {
        console.error('❌ Send OTP button not found');
    }
    
    // Function to handle successful login
    function handleSuccessfulLogin() {
        console.log('🎉 Login successful, updating UI');
        isLoggedIn = true;
        currentUser = {
            id: 1,
            name: 'prasanna',
            email: 'prasannadasari006@gmail.com',
            phone: '9701690259',
            avatar: 'https://via.placeholder.com/100',
            addresses: [],
            orders: []
        };
        
        // Save user data to localStorage for persistence
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(currentUser));
        
        // Update UI
        updateLoginState();
        checkLoginStatusAndUpdateUI();
        
        // Show success message
        showNotification('Login successful!');
        
        // Close login modal
        closeLoginModal();
        
        // Display restaurants and initialize features
        displayRestaurants();
        initializeFeatures();
    }

    console.log('✅ Login system initialized successfully');
});

// Test function to check if everything is working
function testLoginSystem() {
    console.log('=== Testing Login System ===');
    
    // Check if modal exists
    const loginModal = document.getElementById('loginModal');
    console.log('Login modal exists:', !!loginModal);
    
    // Check if button exists
    const loginBtn = document.getElementById('loginRequiredBtn');
    console.log('Login button exists:', !!loginBtn);
    
    // Check if function is available
    console.log('openLoginModal function available:', typeof openLoginModal);
    
    // Check if function is on window
    console.log('openLoginModal on window:', typeof window.openLoginModal);
    
    // Try to open modal
    if (loginModal) {
        console.log('Attempting to open modal...');
        loginModal.classList.add('active');
        console.log('Modal classes after opening:', loginModal.className);
    }
}

window.testLoginSystem = testLoginSystem;

// Test function to verify login credentials
function testLoginCredentials() {
    console.log('🧪 Testing login credentials...');
    
    const testEmail = 'prasannadasari006@gmail.com';
    const testPassword = 'Devi1413';
    
    console.log('📧 Test email:', `"${testEmail}"`);
    console.log('🔑 Test password:', `"${testPassword}"`);
    console.log('📧 Email length:', testEmail.length);
    console.log('🔑 Password length:', testPassword.length);
    
    // Test the exact comparison
    const emailMatch = testEmail === 'prasannadasari006@gmail.com';
    const passwordMatch = testPassword === 'Devi1413';
    
    console.log('📧 Email comparison result:', emailMatch);
    console.log('🔑 Password comparison result:', passwordMatch);
    
    if (emailMatch && passwordMatch) {
        console.log('✅ Credentials are correct!');
        // Try to trigger login
        if (typeof handleSuccessfulLogin === 'function') {
            console.log('🎉 Triggering successful login...');
            handleSuccessfulLogin();
        } else {
            console.error('❌ handleSuccessfulLogin function not found');
        }
    } else {
        console.error('❌ Credential comparison failed');
    }
}

// Make test function globally available
window.testLoginCredentials = testLoginCredentials;

// Restaurants and Menu items data
const restaurants = [
    {
        id: 1,
        name: "Dakshin Haveli",
        cuisine: "Indian, Chinese",
        rating: 4.5,
        deliveryTime: "30-40 min",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
        menuItems: [
            {
                id: 1,
                name: "Mixed nonveg biryani",
                category: "nonveg-main",
                price: 250,
                description: "Aromatic rice dish with mixed non-vegetarian ingredients",
                image: "https://i.pinimg.com/736x/96/27/fe/9627fe1ec0ac0831e0fd8ad88d03a988.jpg",
                feedback: []
            },
            {
                id: 2,
                name: "Paneer Tikka",
                category: "veg-starters",
                price: 180,
                description: "Grilled cottage cheese with Indian spices",
                image: "https://img.freepik.com/premium-photo/paneer-tikka-is-indian-cuisine-dish-with-grilled-paneer-cheese-with-vegetables-spices-indian-food_781325-5565.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 3,
                name: "Gulab Jamun",
                category: "desserts",
                price: 150,
                description: "Stir-fried noodles with mixed vegetables",
                image:"https://i.pinimg.com/736x/41/c7/bf/41c7bf3422cff4a9ac1fb49f4d545513.jpg",
                feedback: []
            },
            {
                id: 4,
                name: "Soft Noodles",
                category: "veg-noodles",
                price: 249,
                description: "Stir-fried noodles with mixed vegetables and Indian spices",
                image: "https://images.pexels.com/photos/2764905/pexels-photo-2764905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                feedback: []
            },
            {
                id: 5,
                name: "Double Egg Noodles",
                category: "nonveg-noodles",
                price: 249,
                description: "Stir-fried noodles with mixed vegetables and double egg",
                image: "https://img.freepik.com/free-photo/high-angle-traditional-asian-meal-with-chopsticks_23-2148694371.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 6,
                name: "SchezwanChicken Noodles",
                category: "nonveg-noodles",
                price: 299,
                description: "Stir-fried noodles with chicken and mixed vegetables",
                image: "https://img.freepik.com/premium-photo/chicken-hakka-schezwan-noodles-served-bowl-with-chopsticks_466689-46474.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 7,
                name: "Egg Noodles",
                category: "nonveg-noodles",
                price: 249,
                description: "Stir-fried noodles with Egg and Indian spices",
                image: "https://img.freepik.com/free-photo/world-cuisine-with-delicious-food_23-2151890021.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 8,
                name: "Cheesy Noodles",
                category: "veg-noodles",
                price: 249,
                description: "Stir-fried noodles with mixed vegetables,cheese and Indian spices",
                image: "https://img.freepik.com/premium-photo/schezwan-noodles-vegetable-hakka-noodles-chow-mein-is-popular-indo-chinese-recipes-served-bowl-plate-with-wooden-chopsticks-selective-focus_466689-33192.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 9,
                name: "Schezwan Noodles",
                category: "veg-noodles",
                price: 249,
                description: "Stir-fried noodles with mixed vegetables and Indian spices",
                image: "https://img.freepik.com/premium-photo/chicken-hakka-schezwan-noodles-served-bowl-with-chopsticks_466689-46532.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 10,
                name: "Soupy Noodles",
                category: "veg-noodles",
                price: 249,
                description: "Stir-fried noodles with mixed vegetables and Indian spices which is served as a soup",
                image: "https://img.freepik.com/free-photo/world-cuisine-with-delicious-food_23-2151890001.jpg?ga=GA1.1.904447893.1748708277&semt=ais_hybrid&w=740",
                feedback: []
            },
            {
                id: 11,
                name: "Tomato Soup",
                category: "veg-soups",
                price: 120,
                description: "Classic tomato soup with herbs and croutons",
                image: "https://i.pinimg.com/736x/49/6f/79/496f79b0521d55cc214a914fe55641ed.jpg",
                feedback: []
            },
            {
                id: 12,
                name: "Sweet Corn Soup",
                category: "veg-soups",
                price: 130,
                description: "Creamy sweet corn soup with vegetables",
                image: "https://i.pinimg.com/736x/5c/99/7e/5c997e64eb005364c25e613b8d9e68e4.jpg",
                feedback: []
            },
            {
                id: 13,
                name: "Chicken Soup",
                category: "nonveg-soups",
                price: 150,
                description: "Hearty chicken soup with vegetables and herbs",
                image: "https://i.pinimg.com/736x/99/54/49/99544970fff087f099d5be49d6326f65.jpg",
                feedback: []
            },
            {
                id: 14,
                name: "Hot & Sour Soup",
                category: "nonveg-soups",
                price: 140,
                description: "Spicy and tangy soup with chicken and vegetables",
                image: "https://i.pinimg.com/736x/bf/99/5b/bf995b5fe2198c198f58ddfebecd6897.jpg",
                feedback: []
            },
            {
                id: 15,
                name: "Chilly Chicken",
                category: "nonveg-starters",
                price: 299,
                description: "Crispy fried chicken tossed in spicy sauce with bell peppers",
                image: "https://i.pinimg.com/736x/1e/0e/84/1e0e842b5a7fa11de1ea6606af2dbc0d.jpg",
                feedback: []
            },
            {
                id: 16,
                name: "Tandoori Chicken Full Bird",
                category: "nonveg-starters",
                price: 299,
                description: "Whole chicken marinated in yogurt and spices, cooked in tandoor",
                image: "https://i.pinimg.com/736x/68/20/6b/68206b4297e23c132ede5d575a1c0d7a.jpg",
                feedback: []
            },
            {
                id: 17,
                name: "Tandoori Chicken Half Bird",
                category: "nonveg-starters",
                price: 299,
                description: "Half chicken marinated in yogurt and spices, cooked in tandoor",
                image: "https://i.pinimg.com/736x/28/a9/fe/28a9fee077780e608db1e77685adc36e.jpg",
                feedback: []
            },
            {
                id: 18,
                name: "Chicken Majestic",
                category: "nonveg-starters",
                price: 299,
                description: "Special chicken preparation with rich gravy and spices",
                image: "https://i.pinimg.com/736x/bc/df/f3/bcdff35b4dbb969c8c3ad51b47cdead4.jpg",
                feedback: []
            },
            {
                id: 19,
                name: "Chicken Tangdi Kabab",
                category: "nonveg-starters",
                price: 299,
                description: "Chicken drumsticks marinated in spices and grilled to perfection",
                image: "https://i.pinimg.com/736x/5b/ba/0d/5bba0ddcb6ac77f51b24c7ad585b1234.jpg",
                feedback: []
            },
            {
                id: 20,
                name: "Chicken Kabab",
                category: "nonveg-starters",
                price: 299,
                description: "Minced chicken mixed with spices and grilled on skewers",
                image: "https://i.pinimg.com/736x/62/fb/b9/62fbb97b4c4ebe60170a2e9d05b8fe16.jpg",
                feedback: []
            },
            {
                id: 21,
                name: "Lemon Chicken",
                category: "nonveg-starters",
                price: 299,
                description: "Crispy chicken tossed in tangy lemon sauce",
                image: "https://i.pinimg.com/736x/4b/eb/fe/4bebfe1c483838f1946fbc0ee9769f47.jpg",
                feedback: []
            },
            {
                id: 22,
                name: "Chicken Nuggets",
                category: "nonveg-starters",
                price: 299,
                description: "Crispy breaded chicken pieces served with dipping sauce",
                image: "https://i.pinimg.com/736x/14/e8/93/14e893bb9d559dfe8e3ae17900abe222.jpg",
                feedback: []
            },
            {
                id: 23,
                name: "Veg Manchurian",
                category: "veg-starters",
                price: 299,
                description: "Vegetables and sauces in a spicy and tangy sauce",
                image: "https://i.pinimg.com/736x/43/32/37/433237e9d79bf05d302acd03672df1a1.jpg",
                feedback: []
            },
            {
                id: 24,
                name: "chilly Mushroom",
                category: "veg-starters",
                price: 299,
                description: "Mushrooms and sauces in a spicy and tangy sauce",
                image: "https://i.pinimg.com/736x/9e/64/f5/9e64f587b622e133792cb9977ced14bb.jpg",
                feedback: []
            },
            {
                id: 25,
                name: "Baby corn",
                category: "veg-starters",
                price: 299,
                description: "Baby corn and sauces in a spicy and tangy sauce",
                image: "https://i.pinimg.com/736x/ba/9e/fd/ba9efd7b5bb60e9b2b82d4a85fec1770.jpg",
                feedback: []
            },
            {
                id: 26,
                name: "Veg Biryani",
                category: "veg-main",
                price: 299,
                description: "Vegetables and rice in a spicy and tangy sauce",
                image: "https://i.pinimg.com/736x/3c/d4/70/3cd4702a62dd19b5328bc6c2399e2e74.jpg",
                feedback: []
            },
            {
                id: 27,
                name: "Chicken Dum Biryani",
                category: "nonveg-main",
                price: 299,
                description: "Chicken and rice in a spicy and tangy sauce",
                image: "https://i.pinimg.com/736x/57/58/8b/57588b32c55b721df9710bfe1093fe1f.jpg",
                feedback: []
            },
            {
                id: 28,
                name: "Chicken fry piece Biryani",
                category: "nonveg-main",
                price: 299,
                description: "Chicken and rice in a spicy and tangy sauce",
                image: "https://i.pinimg.com/736x/d1/d7/7f/d1d77fab9413aaaf68d80ab4d795ada7.jpg",
                feedback: []
            },
            {
                id: 29,
                name: "Mutton Biryani",
                category: "nonveg-main",
                price: 299,
                description: "Mutton and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/e1/e9/a9/e1e9a9bb4458f6cd0f0aba5fe4994f2a.jpg",
                feedback: []
            },
            {
                id: 30,
                name: "Chicken Mughlai Biryani",
                category: "nonveg-main",
                price: 299,
                description: "Chicken and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/d9/33/ec/d933ecb95a17ef2bfd234d8e4988e62b.jpg",
                feedback: []
            },
            {
                id: 31,
                name: "Chicken fried rice",
                category: "nonveg-main",
                price: 299,
                description: "Chicken and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/c2/df/1c/c2df1cdc06db8cf5f5eb4c69976c9d03.jpg",
                feedback: []
            },
            {
                id: 32,
                name: "Chicken schezwan fried rice",
                category: "nonveg-main",
                price: 299,
                description: "Chicken and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/19/12/56/191256dda91f4875e315517d45bfbfaf.jpg",
                feedback: []
            },
            {
                id: 33,
                name: "Nethi karam Chicken Pulav",
                category: "nonveg-main",
                price: 299,
                description: "Chicken and rice in a spicy and tangy sauce with a unique flavor with a unique flavor",
                image: "https://i.pinimg.com/736x/b0/0d/99/b00d99681120d6e973115b8f10612c67.jpg",
                feedback: []
            },
            {
                id: 34,
                name: "Nethi karam Mutton Pulav",
                category: "nonveg-main",
                price: 299,
                description: "Mutton and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/6c/f4/83/6cf48394168034cc994d08137f8fbd0b.jpg",
                feedback: []
            },
            {
                id: 35,
                name: "Nethi karam prawns Pulav",
                category: "nonveg-main",
                price: 299,
                description: "Prawns and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/6e/a1/75/6ea175cdb123b2dc497d264cbc1e3cde.jpg",
                feedback: []
            },
            {
                id: 36,
                name: "veg Fried Rice",
                category: "veg-main",
                price: 299,
                description: "Vegetables and rice in a spicy and tangy sauce with a unique flavor ",
                image: "https://i.pinimg.com/736x/1f/7e/a8/1f7ea8e1428dc52cc7825130dd548292.jpg",
                feedback: []
            },
            {
                id: 37,
                name: "baby corn Fried Rice",
                category: "veg-main",
                price: 299,
                description: "Vegetables,baby corn and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/df/e1/08/dfe1081a9b6061b87127b7a96bcdf9d0.jpg",
                feedback: []
            },
            {
                id: 38,
                name: "panner kaju Fried Rice",
                category: "veg-main",
                price: 299,
                description: "Panner and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/d3/58/fb/d358fbe76a7a01e41bc15d81911cbd0f.jpg",
                feedback: []
            },
            {
                id: 39,
                name: "mushroom biryani",
                category: "veg-main",
                price: 299,
                description: "Mushroom and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/78/45/02/7845021dd6a3e62bf81218acba3e2e8e.jpg",
                feedback: []
             },
            {
                id: 40,
                name: "ulavacharu biryani",
                category: "veg-main",
                price: 299,
                description: "Ulavacharu and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/7e/74/06/7e7406f909bab2b7d69217ab8fc82fa3.jpg",
                feedback: []
            },
            {
                id: 41,
                name: "kaju panner biryani",
                category: "veg-main",
                price: 299,
                description: "Kaju and panner in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/dc/e3/a4/dce3a493d5db0110d05050304f284ee4.jpg",
                feedback: []
            },
            {
                id: 42,
                name: "Mixed veg biryani",
                category: "veg-main",
                price: 299,
                description: "Mixed veg and rice in a spicy and tangy sauce with a unique flavor",
                image: "https://i.pinimg.com/736x/35/94/9e/35949eefdd2a2a12e0179b4c1d5f0167.jpg",
                feedback: []
            },
            {
                id: 43,
                name: "Kunafa",
                category: "desserts",
                price: 149,
                description: "A Middle Eastern dessert made with shredded phyllo dough, filled with sweet cheese, soaked in sugar syrup, and topped with pistachios",
                image: "https://i.pinimg.com/736x/6f/1e/bd/6f1ebda74c86d772bec832b38ca4eeb6.jpg",
                feedback: []
            },
            {
                id: 44,
                name: "Double ka meetha",
                category: "desserts",
                price: 149,
                description: "A rich Indian bread pudding made with deep-fried bread slices soaked in sweetened milk, flavored with cardamom and garnished with nuts",
                image: "https://i.pinimg.com/736x/0a/f8/3b/0af83bf1d5d1843a7c83e800916f1998.jpg",
                feedback: []
            },
            {
                id: 45,
                name: "kaddu ki kheer",
                category: "desserts",
                price: 149,
                description: "A traditional Indian dessert made with grated pumpkin cooked in milk, sweetened with sugar, and flavored with cardamom and nuts",
                image: "https://i.pinimg.com/736x/b9/c1/82/b9c18276dbc96cf9fc3599c07ae3c32f.jpg",
                feedback: []
            },   
            {
                id: 46,
                name: "Rasmalai",
                category: "desserts",
                price: 149,
                description: "Soft cottage cheese dumplings soaked in sweetened, thickened milk flavored with cardamom and saffron, garnished with pistachios",
                image: "https://i.pinimg.com/736x/8c/d9/0b/8cd90bf9409d21492701d4cbc03a87e8.jpg",
                feedback: []
            }  
        ]
    },
    {
        id: 2,
        name: "SRI Kanya",
        cuisine: "Indian",
        rating: 4.2,
        deliveryTime: "25-35 min",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
        menuItems: [

            {
                id: 1,
                name: "Chilly mushroom",
                category: "veg-starters",
                price: 180,
                description: "Crispy mushrooms tossed in spicy sauce",
                image: "https://i.pinimg.com/736x/37/59/0a/37590a17c7b2106c0c31eecf92a8583e.jpg",
                feedback: []
            },
            {
                id: 2,
                name: "Mushroom 65",
                category: "veg-starters",
                price: 160,
                description: "Deep-fried mushrooms with special spices",
                image: "https://i.pinimg.com/736x/2e/2f/33/2e2f330e813c42cad5016de3c8a80dd8.jpg",
                feedback: []
            },
            {
                id: 3,
                name: "Paneer tikka",
                category: "veg-starters",
                price: 200,
                description: "Grilled cottage cheese with Indian spices",
                image: "https://i.pinimg.com/736x/5f/d4/32/5fd4328d6e3d5ad1b01b2c5d132d27e7.jpg",
                feedback: []
            },
            {
                id: 4,
                name: "Cheesy panner balls",
                category: "veg-starters",
                price: 220,
                description: "Deep-fried cheese balls with a crispy coating",
                image:"https://i.pinimg.com/736x/82/1d/db/821ddb59f59656d8fd2752848c97bf33.jpg",
                feedback: []
            },
            {
                id: 5,
                name: "veg Manchow Soup",
                category: "veg-soups",
                price: 130,
                description: "Spicy vegetable soup with crispy noodles",
                image: "https://i.pinimg.com/736x/ca/ec/45/caec45f62f12c720d17b14dfc2ae61eb.jpg",
                feedback: []
            },
            {
                id: 6,
                name: "Hot n sour Soup",
                category: "veg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/a4/89/4c/a4894cfc82a68d928fa0f1cc73decb48.jpg",
                feedback: []
            },
            {
                id: 7,
                name: "tomato soup",
                category: "veg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/dc/88/5e/dc885e424e2cc36080e3ffaee09b6dfb.jpg",
                feedback: []
            },
            {
                id: 8,
                name: "corn Soup",
                category: "veg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/e9/ec/63/e9ec63ebeb327cd75920034dd870d9a3.jpg",
            },
            {
                id: 9,
                name: "Veg soft noodles",
                category: "veg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/bc/53/59/bc535929578f96c7dd60bb855cbf3845.jpg",
                feedback: []
            },
            {
                id: 10,
                name: "Panner noodles",
                category: "veg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/a7/56/60/a75660f75a65081553cb474ff9783f9a.jpg",
                feedback: []
            },
            {
                id: 11,
                name: "mushroom noodles",
                category: "veg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/37/2b/c9/372bc9580166c21d16f176b94781253f.jpg",
                feedback: []
            },
            {
                id: 12,
                name: "schezwan noodles",
                category: "veg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/6e/62/13/6e6213a37c614988ff441c8962b3b080.jpg",
                feedback: []
            },
            {
                id: 13,
                name: "veg biryani",
                category: "veg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/48/4c/c8/484cc8de466de0d1c08eda2c2de7b44d.jpg",
                feedback: []
            },
            {
                id: 14,
                name: "panner biryani",
                category: "veg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/48/bd/d9/48bdd97b9a6d9007eceb8eaf6ce7b779.jpg",
                feedback: []
            },
            {
                id: 15,
                name: "veg spcl biryani",
                category: "veg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/52/10/da/5210da5a6edacb2cb48787de056d4683.jpg",
                feedback: []
            },
            {
                id: 16,
                name: "mushroom biryani",
                category: "veg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/78/45/02/7845021dd6a3e62bf81218acba3e2e8e.jpg",
                feedback: []
            },
            {
                id: 17,
                name: "chicken manchow soup",
                category: "nonveg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/cf/ad/6c/cfad6c1666395e3340b5bed6bd2e63d1.jpg",
                feedback: []
            },
            {
                id: 18,
                name: "chicken dragon soup",
                category: "nonveg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/2b/49/30/2b49303cfeb95e70d696b2d929771dc0.jpg",
                feedback: []
            },
            {
                id: 19,
                name: "chicken hot n sour soup",
                category: "nonveg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/ac/7f/77/ac7f77edf59fc3ea12f8de7c67bcc5dd.jpg",
                feedback: []
            },
            {
                id: 20,
                name: "chicken corn soup",
                category: "nonveg-soups",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/8b/1d/1b/8b1d1b81991d2e7c79db9d151d3f0509.jpg",
                feedback: []
            },
            {
                id: 21,
                name: "chilly fish",
                category: "nonveg-starters",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/54/79/59/547959d0b5a11d79c179025c7691327d.jpg",
                feedback: []
            },
            {
                id: 22,
                name: "chicken tikka",
                category: "nonveg-starters",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/3e/25/0e/3e250ec73c8ee8a5f8529fa2d5bcb354.jpg",
                feedback: []
            },
            {
                id: 23,
                name: "reshmi kabab",
                category: "nonveg-starters",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/db/43/a2/db43a29b35b14d1dc881683442ec621b.jpg",
                feedback: []
            },
            {
                id: 24,
                name: "kalmi kabab",
                category: "nonveg-starters",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/04/ee/5f/04ee5f71d50cccbbe6f7ada89b7242e0.jpg",
                feedback: []
            },
            {
                id: 25,
                name: "chicken frypiece biryani",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/eb/39/90/eb3990eebad715277b28fa81ed5f735d.jpg",
                feedback: []
            },
            {
                id: 26,
                name: "chicken dum biryani",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/cf/d3/f5/cfd3f5999c08aa86ed44e630ed1dd332.jpg",
                feedback: []
            },
            {
                id: 27,
                name: "Dil kush biryani",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/ab/1f/1a/ab1f1a706277bf4c3b95a296a39ad569.jpg",
                feedback: []
            },
            {
                id: 28,
                name: "Mughlai biryani",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/09/74/98/09749887b54c4e1698ad449f979f50e1.jpg",
                feedback: []
            },
            {
                id: 29,
                name: "mutton dum biryani",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/e1/e9/a9/e1e9a9bb4458f6cd0f0aba5fe4994f2a.jpg",
                feedback: []
            },
            {
                id: 30,
                name:" nalli gosh biryani",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/64/d4/a6/64d4a66417645b76cde465a47f258752.jpg",
                feedback: []
            },
            {
                id: 31,
                name: "chicken mandi",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/6e/8e/59/6e8e59b31500ec74df637457ae3d1181.jpg",
                feedback: []
            },
            {
                id: 32,
                name: "chicken juicy mandi",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/6e/8e/59/6e8e59b31500ec74df637457ae3d1181.jpg",
                feedback: []
            },
            {
                id: 33,
                name: "mutton mandi",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/cd/b5/b9/cdb5b9625b1cdfcf5a7cae60e2764772.jpg",
                feedback: []
            },
            {
                id: 34,
                name: "mutton juicy mandi",
                category: "nonveg-main",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/62/be/51/62be519eeac207227169f805a92243f8.jpg",
                feedback: []
            },
            {
                id: 35,
                name: "egg noodles",
                category: "nonveg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/93/46/6d/93466d544c7f18c2f30273f26d69f91b.jpg",
                feedback: []
            },
            {
                id: 36,
                name: "chicken soft noodles",
                category: "nonveg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/27/9d/4f/279d4fcf5315c979f887a638470696f8.jpg",
                feedback: []
            },
            {
                id: 37,
                name: "chicken spcl noodles",
                category: "nonveg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/35/fa/13/35fa1393202ff6d2faf50000664520ee.jpg",
                feedback: []
            },
            {
                id: 38,
                name: "schezwan noodles",
                category: "nonveg-noodles",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/78/07/2f/78072f977a359c9a3f9579d4a56e223d.jpg",
                feedback: []
            },
            {
                id: 39,
                name: "gulabjamun icecream",
                category: "desserts",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/f6/bd/6e/f6bd6eabb38924687ef4c5daf66f5c14.jpg",
                feedback: []
            },
            {
                id: 40,
                name: "apricot delight",
                category: "desserts",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/1f/74/30/1f74307eb4a85f19c60c40c0998d1aba.jpg",
                feedback: []
            },
            {
                id: 41,
                name: "kunafa",
                category: "desserts",
                price: 120,
                description: "Light and clear vegetable soup",
                image:"https://i.pinimg.com/736x/6f/1e/bd/6f1ebda74c86d772bec832b38ca4eeb6.jpg",
                feedback: []
            },
            {
                id: 42,
                name: "rabadi",
                category: "desserts",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/1f/37/48/1f3748e1d2a895d6a16ee9a9d8a66c4f.jpg",
                feedback: []
            },
            {
                id: 43,
                name: "rasmalai",
                category: "desserts",
                price: 120,
                description: "Light and clear vegetable soup",
                image: "https://i.pinimg.com/736x/fd/09/38/fd093848115fc1a2b8140604b92cbac2.jpg",
                feedback: []
            },

            
        ]
    },
    {
        id: 3,
        name: "Heavens inn",
        cuisine: "Chinese",
        rating: 4.6,
        deliveryTime: "35-45 min",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbmVzZSUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
        menuItems: [
            {
                id: 19,
                name: "sweet corn Soup",
                category: "veg-soups",
                price: 140,
                description: "Clear soup with vegetable wontons",
                image: "https://i.pinimg.com/736x/e7/11/c4/e711c4f4b44391f9b34b4ab27ffeb453.jpg",
                feedback: []
            },
            {
                id: 20,
                name: "manchow Soup",
                category: "veg-soups",
                price: 130,
                description: "Spicy and tangy vegetable soup",
                image: "https://i.pinimg.com/736x/cc/9f/ee/cc9feea4dba6acd6f161b3df452742d1.jpg",
                feedback: []
            },
            {
                id: 21,
                name: "tomato Soup",
                category: "veg-soups",
                price: 130,
                description: "Spicy and tangy vegetable soup",
                image: "https://i.pinimg.com/736x/2f/1f/c8/2f1fc85eb75f7bc166ba6a4f217d49d8.jpg",
                feedback: []
            },
            {
                id: 22,
                name: "lemon coriander Soup",
                category: "veg-soups",
                price: 130,
                description: "Spicy and tangy vegetable soup",
                image: "https://i.pinimg.com/736x/c9/db/46/c9db46c89e27229e2a8ede5c45d1f942.jpg",
                feedback: []
            },
            {
                id: 23,
                name: "panner tikka",
                category: "veg-starters",
                price: 180,
                description: "Crispy vegetable spring rolls with sweet chili sauce",
                image: "https://i.pinimg.com/736x/02/71/3e/02713e2e9b4918f2137289de6ac3f2c0.jpg",
                feedback: []
            },
            {
                id: 24,
                name: "panner 65",
                category: "veg-starters",
                price: 180,
                description: "Crispy vegetable spring rolls with sweet chili sauce",
                image: "https://i.pinimg.com/736x/4a/70/6c/4a706c303161f1d1fbdc4123a3f3da3c.jpg",
                feedback: []
            },
            {
                id: 25,
                name: "panner popcorn",
                category: "veg-starters",
                price: 180,
                description: "Crispy panner spring rolls with sweet chili sauce",
                image: "https://i.pinimg.com/1200x/1f/42/78/1f4278ac2569339e227cbfc57c4f5c55.jpg",
                feedback: []
            },
            {
                id: 26,
                name: "mushroom 65",
                category: "veg-starters",
                price: 180,
                description: "Crispy mushroom fritters with spicy dipping sauce",
                image: "https://i.pinimg.com/736x/76/8b/a3/768ba3ead58a9e960b9c2ea8da1a687d.jpg",
                feedback: []
            },
            {
                id: 27,
                name: "chilly mushroom",
                category: "veg-starters",
                price: 180,
                description: "Crispy mushroom fritters with spicy dipping sauce",
                image: "https://i.pinimg.com/1200x/1d/c8/d5/1dc8d589c527b3590af29485b90c5572.jpg",
                feedback: []
            },
            {
                id: 28,
                name: "garlic mushroom",
                category: "veg-starters",
                price: 180,
                description: "Crispy garlic mushroom fritters with spicy dipping sauce",
                image: "https://i.pinimg.com/736x/bd/13/9e/bd139e51701ae25b936e1f9f1412ab15.jpg",
                feedback: []
            },
            {
                id: 29,
                name: "crispy corn",
                category: "veg-starters",
                price: 180,
                description: "Crispy corn fritters with spicy dipping sauce",
                image: "https://i.pinimg.com/736x/cb/d0/8a/cbd08ac03b39f37bf5c1ef373d57892f.jpg",
                feedback: []
            },
            {
                id: 30,
                name: "Veg Fried Rice",
                category: "veg-main",
                price: 170,
                description: "Stir-fried rice with mixed vegetables",
                image: "https://i.pinimg.com/1200x/9a/8f/69/9a8f69fd582406faad3c2a31ca4b7808.jpg",
                feedback: []
            },
             {
                id: 31,
                name: "Paneer Fried Rice",
                category: "veg-main",
                price: 170,
                description: "Stir-fried rice with mixed vegetables",
                image: "https://i.pinimg.com/736x/1e/c7/ae/1ec7ae1d62c6a6ca35cfce0afbfa3000.jpg",
                feedback: []
            }, {
                id: 32,
                name: "Mushroom Fried Rice",
                category: "veg-main",
                price: 170,
                description: "Stir-fried rice with mixed vegetables",
                image: "https://i.pinimg.com/736x/f6/83/23/f6832360db532a65c17e2bc58f0e219c.jpg",
                feedback: []
            },
             {
                id: 33,
                name: "spcl Veg Fried Rice",
                category: "veg-main",
                price: 170,
                description: "Stir-fried rice with mixed vegetables",
                image: "https://i.pinimg.com/1200x/d1/c6/f8/d1c6f87a8e16e160335020c8bbde4c3c.jpg",
                feedback: []
            },
             {
                id: 34,
                name: "mixed veg biryani",
                category: "veg-main",
                price: 170,
                description: "Aromatic basmati rice with mixed vegetables",
                image: "https://i.pinimg.com/736x/fb/35/c1/fb35c1f316262775e2338053fe551826.jpg",
                feedback: []
            },
             {
                id: 35,
                name: "paneer biryani",
                category: "veg-main",
                price: 170,
                description: "Aromatic basmati rice with paneer",
                image: "https://i.pinimg.com/736x/ce/7e/09/ce7e09275ab387656a09f452f8c1d677.jpg",
                feedback: []
            },
             {
                id: 36,
                name: "mushroom biryani",
                category: "veg-main",
                price: 170,
                description: "Aromatic basmati rice with mushrooms",
                image: "https://i.pinimg.com/736x/78/45/02/7845021dd6a3e62bf81218acba3e2e8e.jpg",
                feedback: []
            },
             {
                id: 37,
                name: "Bismillabath",
                category: "veg-main",
                price: 170,
                description: "Aromatic basmati rice with mixed vegetables",
                image: "https://i.pinimg.com/736x/0d/b4/53/0db453001671dba830e7a48976dfc6ff.jpg",
                feedback: []
            },
             {
                id: 38,
                name: "Curd Rice",
                category: "veg-main",
                price: 170,
                description: "Chilled yogurt rice with spices",
                image: "https://i.pinimg.com/736x/91/bf/04/91bf0422c406ab221ef3f78febfd2aff.jpg",
                feedback: []
            },
            {
                id: 39,
                name: "Chicken Hot & Sour Soup",
                category: "nonveg-soups",
                price: 150,
                description: "Spicy and tangy soup with chicken",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGhvdCUyMGFuZCUyMHNvdXJ8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 40,
                name: "Chicken manchow Soup",
                category: "nonveg-soups",
                price: 150,
                description: "Clear soup with chicken and sweet corn",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGNvcm4lMjBzb3VwfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 41,
                name: "Chicken dragon Soup",
                category: "nonveg-soups",
                price: 150,
                description: "Tangy soup with chicken and fresh coriander",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGxlbW9uJTIwY29yaWFuZGVyfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 42,
                name: "Paya Soup",
                category: "nonveg-soups",
                price: 150,
                description: "Spicy trotters soup with herbs",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGF5YSUyMHNvdXAlMjB3aXRoJTIwaGVycHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 43,
                name: "Spring Rolls",
                category: "veg-starters",
                price: 180,
                description: "Crispy vegetable spring rolls with sweet chili sauce",
                image: "https://i.pinimg.com/1200x/29/41/a6/2941a6153669acb5a03c375fd50c54c4.jpg",
                feedback: []
            },
            {
                id: 41,
                name: "Chilli Chicken",
                category: "nonveg-starters",
                price: 200,
                description: "Crispy chicken tossed in spicy sauce",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHNwcmluZyUyMHJvbGxzfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 42,
                name: "Chicken 65",
                category: "nonveg-starters",
                price: 200,
                description: "Spicy deep-fried chicken bites",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMDY1fGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 43,
                name: "Chicken Lollipop",
                category: "nonveg-starters",
                price: 200,
                description: "Deep-fried chicken drumettes with a tangy sauce",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGxvbGxpcHAlMjBzb3VwfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 44,
                name: "pepper Chicken",
                category: "nonveg-starters",
                price: 200,
                description: "Spicy pepper chicken with herbs",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHBvcHBlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 45,
                name: "garlic Chicken",
                category: "nonveg-starters",
                price: 200,
                description: "Garlic-flavored chicken with herbs",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGdhcmxpYyUyMGNoaWNrZW58ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 46,
                name: "lemon Chicken",
                category: "nonveg-starters",
                price: 220,
                description: "Spicy chicken tossed in lemon sauce",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMG1hbmNodXJpb258ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 47,
                name: "Chicken Tandoori",
                category: "nonveg-starters",
                price: 250,
                description: "Spicy grilled chicken marinated in yogurt and spices",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHRhbmRvcmV8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 48,
                name: "Veg Noodles",
                category: "veg-noodles",
                price: 160,
                description: "Stir-fried noodles with mixed vegetables",
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 49,
                name: "Chicken Soft Noodles",
                category: "nonveg-noodles",
                price: 190,
                description: "Stir-fried noodles with chicken and vegetables",
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMG5vb2RsZSUyMHNvdXB8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 50,
                name: "egg Noodles",
                category: "nonveg-noodles",
                price: 180,
                description: "Stir-fried noodles with egg and vegetables",
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWdnJTIwbm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 44,
                name: "Veg Fried Rice",
                category: "veg-main",
                price: 170,
                description: "Stir-fried rice with mixed vegetables",
                image: "https://i.pinimg.com/1200x/aa/1b/a2/aa1ba211f9d8867b605c26f0c0ff9ebf.jpg",
                feedback: []
            },
            {
                id: 45,
                name: "Chicken Fried Rice",
                category: "nonveg-main",
                price: 200,
                description: "Stir-fried rice with chicken and vegetables",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGZyaWVkJTIwcmljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            }
        ]
    },
    {
        id: 4,
        name: "Pasta Paradise",
        cuisine: "Italian",
        rating: 4.7,
        deliveryTime: "30-40 min",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXRhbGlhbiUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
        menuItems: [
            {
                id: 29,
                name: "Minestrone Soup",
                category: "veg-soups",
                price: 150,
                description: "Classic Italian vegetable soup with pasta",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWluZXN0cm9uZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 30,
                name: "Tomato Basil Soup",
                category: "veg-soups",
                price: 140,
                description: "Creamy tomato soup with fresh basil",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvJTIwYmFzaWwlMjBzb3VwfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 31,
                name: "Chicken Noodle Soup",
                category: "nonveg-soups",
                price: 160,
                description: "Hearty chicken soup with pasta",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMG5vb2RsZSUyMHNvdXB8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 32,
                name: "Seafood Soup",
                category: "nonveg-soups",
                price: 180,
                description: "Rich seafood soup with herbs",
                image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VhZm9vZCUyMHNvdXB8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 33,
                name: "Garlic Bread",
                category: "veg-starters",
                price: 120,
                description: "Toasted bread with garlic butter and herbs",
                image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 34,
                name: "Bruschetta",
                category: "veg-starters",
                price: 140,
                description: "Toasted bread topped with tomatoes and basil",
                image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJ1c2NoZXR0YXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 35,
                name: "Margherita Pizza",
                category: "veg-main",
                price: 250,
                description: "Classic pizza with tomato sauce and mozzarella",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            },
            {
                id: 36,
                name: "Pepperoni Pizza",
                category: "nonveg-main",
                price: 280,
                description: "Pizza topped with pepperoni and cheese",
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 37,
                name: "Veg Pasta",
                category: "veg-main",
                price: 220,
                description: "Pasta with mixed vegetables in tomato sauce",
                image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnJTIwcGFzdGF8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                feedback: []
            },
            {
                id: 38,
                name: "Chicken Pasta",
                category: "nonveg-main",
                price: 250,
                description: "Pasta with grilled chicken in white sauce",
                image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHBhc3RhfGVufDB8fDB8fHww&w=1000&q=80",
                feedback: []
            }
        ]
    }
];

console.log('Restaurants array:', restaurants);

// Initialize slideshow
function initializeSlideshow() {
    console.log('Initializing slideshow...');
    const slideshowWrapper = document.querySelector('.slideshow-wrapper');
    const dotsContainer = document.querySelector('.slideshow-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (!slideshowWrapper || !dotsContainer || !prevBtn || !nextBtn) {
        console.error('Slideshow elements not found:', {
            slideshowWrapper: !!slideshowWrapper,
            dotsContainer: !!dotsContainer,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn
        });
        return;
    }

    console.log('Found slideshow elements, creating slides...');
    let currentSlide = 0;

    // Create slides from restaurants
    const slidesHTML = restaurants.map(restaurant => `
        <div class="slide" data-restaurant-id="${restaurant.id}">
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="slide-content">
                <h2>${restaurant.name}</h2>
                <p class="cuisine">${restaurant.cuisine}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${restaurant.rating}</span>
                </div>
                <div class="delivery-time">
                    <i class="fas fa-clock"></i>
                    <span>${restaurant.deliveryTime}</span>
                </div>
                <button class="view-menu-btn" onclick="event.stopPropagation(); displayRestaurantMenu(${restaurant.id})">View Menu</button>
            </div>
        </div>
    `).join('');

    // Create dots
    const dotsHTML = restaurants.map((_, index) => `
        <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
    `).join('');

    // Add slides and dots to the DOM
    slideshowWrapper.innerHTML = slidesHTML;
    dotsContainer.innerHTML = dotsHTML;

    // Add click event listeners to slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.addEventListener('click', () => {
            const restaurantId = parseInt(slide.dataset.restaurantId);
            displayRestaurantMenu(restaurantId);
        });
    });

    console.log('Slides created:', restaurants.length);

    // Function to update slideshow
    function updateSlideshow() {
        slideshowWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Event listeners for dots
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering slide click
            currentSlide = parseInt(dot.dataset.index);
            updateSlideshow();
        });
    });

    // Event listeners for buttons
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering slide click
        currentSlide = (currentSlide - 1 + restaurants.length) % restaurants.length;
        updateSlideshow();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering slide click
        currentSlide = (currentSlide + 1) % restaurants.length;
        updateSlideshow();
    });

    // Auto-advance slideshow
    setInterval(() => {
        currentSlide = (currentSlide + 1) % restaurants.length;
        updateSlideshow();
    }, 5000);

    // Initial update
    updateSlideshow();
    console.log('Slideshow initialization complete');
}

// Make sure slideshow is initialized when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializeSlideshow();
});

// Login Modal Elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeLogin = document.getElementById('closeLogin');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForms = document.querySelectorAll('.login-form');
const emailLoginForm = document.getElementById('emailLoginForm');
const phoneLoginForm = document.getElementById('phoneLoginForm');
const sendOtpBtn = document.querySelector('.send-otp');

const signupForm= document.getElementById('signupForm');
const signupLinks = document.querySelectorAll('.signup-link');
const loginLinks = document.querySelectorAll('.login-link');

// Show signup form
signupLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loginForms.forEach(form => form.classList.remove('active'));
        signupForm.classList.add('active');
        tabBtns.forEach(btn => btn.classList.remove('active'));
    });
});

// Show login form
loginLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        document.getElementById('emailLoginForm').classList.add('active');
        tabBtns[0].classList.add('active');
    });
});

// --- SIGNUP FORM HANDLER ---
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const name = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            showNotification('Account created successfully!');
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            showNotification(data.error || 'Signup failed.');
        }
    } catch (error) {
        showNotification('Signup failed. Please try again.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// --- LOGIN FORM HANDLER ---
emailLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = emailLoginForm.querySelector('input[type="email"]').value.trim();
    const password = emailLoginForm.querySelector('input[type="password"]').value.trim();

    if (!email || !password) {
        showNotification('Please enter both email and password');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            currentUser = { name: data.name, email: data.email };
            isLoggedIn = true;
            updateLoginState();
            checkLoginStatusAndUpdateUI();
            showNotification('Login successful!');
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
            displayRestaurants();
            initializeFeatures();
            emailLoginForm.reset();
        } else {
            showNotification(data.error || 'Invalid email or password');
            emailLoginForm.querySelector('input[type="password"]').value = '';
        }
    } catch (error) {
        showNotification('Login failed. Please try again.');
        emailLoginForm.querySelector('input[type="password"]').value = '';
    }
});

// Shopping cart
let cart = [];

// DOM Elements
const menuGrid = document.querySelector('.menu-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartCount = document.querySelector('.cart-count');

// Product Modal Elements
const productModal = document.getElementById('productModal');
const closeProduct = document.getElementById('closeProduct');
const productModalImage = document.getElementById('productModalImage');
const productModalName = document.getElementById('productModalName');
const productModalDescription = document.getElementById('productModalDescription');
const productModalPrice = document.getElementById('productModalPrice');
const feedbackList = document.getElementById('feedbackList');
const feedbackText = document.getElementById('feedbackText');
const submitFeedback = document.getElementById('submitFeedback');
const modalAddToCart = document.getElementById('modalAddToCart');
const customerImage = document.getElementById('customerImage');
let currentProductId = null;

// User Profile Data
let currentUser = null; // Changed from object to null initially
let isLoggedIn = false; // Added login state tracking

// Profile Modal Elements
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const profileNavBtns = document.querySelectorAll('.profile-nav-btn');
const profileTabs = document.querySelectorAll('.profile-tab');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const userJoinDate = document.getElementById('userJoinDate');
const changeAvatar = document.getElementById('changeAvatar');
const orderHistory = document.getElementById('orderHistory');
const addressList = document.getElementById('addressList');
const addAddressBtn = document.getElementById('addAddressBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Tab switching
profileNavBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    profileNavBtns.forEach(b => b.classList.remove('active'));
    profileTabs.forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');
    profileTabs[idx].classList.add('active');
  });
});

// Close modal
closeProfile.addEventListener('click', () => {
  profileModal.classList.remove('active');
  document.body.style.overflow = '';
});

// Avatar change
changeAvatar.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      userAvatar.src = ev.target.result;
      if (currentUser) {
        currentUser.avatar = ev.target.result;
        localStorage.setItem('userData', JSON.stringify(currentUser));
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

// Profile info edit
document.getElementById('profileInfoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!currentUser) return;
  currentUser.name = document.getElementById('editUserName').value;
  currentUser.email = document.getElementById('editUserEmail').value;
  currentUser.phone = document.getElementById('editUserPhone').value;
  currentUser.dob = document.getElementById('editUserDOB').value;
  currentUser.gender = document.getElementById('editUserGender').value;
  localStorage.setItem('userData', JSON.stringify(currentUser));
  updateProfileDisplay();
  showNotification('Profile updated!');
});

// Change password
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!currentUser) return;
  const current = document.getElementById('currentPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const confirm = document.getElementById('confirmNewPassword').value;
  if (newPass !== confirm) {
    showNotification('New passwords do not match!');
    return;
  }
  // For demo: just set password (no real check)
  currentUser.password = newPass;
  localStorage.setItem('userData', JSON.stringify(currentUser));
  showNotification('Password changed!');
  this.reset();
});

// Logout
logoutBtn.addEventListener('click', handleLogout);

// Update profile display
function updateProfileDisplay() {
  if (!currentUser) return;
  userAvatar.src = currentUser.avatar || 'https://via.placeholder.com/100';
  userName.textContent = currentUser.name;
  userEmail.textContent = currentUser.email;
  userPhone.textContent = currentUser.phone ? `Phone: ${currentUser.phone}` : '';
  userJoinDate.textContent = currentUser.createdAt ? `Joined: ${new Date(currentUser.createdAt).toLocaleDateString()}` : '';
  document.getElementById('editUserName').value = currentUser.name;
  document.getElementById('editUserEmail').value = currentUser.email;
  document.getElementById('editUserPhone').value = currentUser.phone || '';
  document.getElementById('editUserDOB').value = currentUser.dob || '';
  document.getElementById('editUserGender').value = currentUser.gender || '';

  // Badges
  document.getElementById('userTypeBadge').textContent = currentUser.userType || 'Regular';
  document.getElementById('userTypeBadge').className = 'badge user-type-badge ' + (currentUser.userType ? currentUser.userType.toLowerCase().replace(' ', '_') : 'regular_user');
  document.getElementById('loyaltyBadge').textContent = currentUser.loyalty || 'Bronze';
  document.getElementById('loyaltyBadge').className = 'badge loyalty-badge ' + (currentUser.loyalty ? currentUser.loyalty.toLowerCase() : 'bronze');

  // Stats
  const stats = [
    { icon: 'fas fa-shopping-bag', number: (currentUser.orders?.length || 0), label: 'Orders' },
    { icon: 'fas fa-map-marker-alt', number: (currentUser.addresses?.length || 0), label: 'Addresses' },
    { icon: 'fas fa-star', number: (currentUser.reviews?.length || 0), label: 'Reviews' },
    { icon: 'fas fa-wallet', number: '₹' + (currentUser.wallet || 0), label: 'Wallet' }
  ];
  document.getElementById('profileStats').innerHTML = stats.map(stat => `
    <div class="stat-card">
      <i class="${stat.icon}"></i>
      <div class="stat-info">
        <span class="stat-number">${stat.number}</span>
        <span class="stat-label">${stat.label}</span>
      </div>
    </div>
  `).join('');

  displayOrderHistory();
  displayAddresses();
}

// Cart Modal Elements
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartIcon = document.querySelector('.cart-icon');

// Function to display all restaurants
function displayRestaurants() {
    const menuSection = document.querySelector('.menu-section');
    menuSection.innerHTML = `
        <h2>Our Restaurants</h2>
        <div class="restaurants-grid">
            ${restaurants.map(restaurant => `
                <div class="restaurant-card" onclick="displayRestaurantMenu(${restaurant.id})">
                    <img src="${restaurant.image}" alt="${restaurant.name}">
                    <div class="restaurant-info">
                        <h3>${restaurant.name}</h3>
                        <p class="cuisine">${restaurant.cuisine}</p>
                        <div class="restaurant-meta">
                            <span class="rating">⭐ ${restaurant.rating}</span>
                            <span class="delivery-time">🕒 ${restaurant.deliveryTime}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to display restaurant menu
function displayRestaurantMenu(restaurantId) {
    console.log('🏪 displayRestaurantMenu called with restaurantId:', restaurantId);
    
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
        console.error('❌ Restaurant not found for ID:', restaurantId);
        return;
    }

    console.log('✅ Found restaurant:', restaurant.name, 'with ID:', restaurantId);

    // Set the current restaurant ID for product modal context
    setCurrentRestaurantId(restaurantId);

    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
    menuContainer.innerHTML = `
        <div class="menu-header">
            <button class="back-btn" onclick="displayRestaurants()">
                <i class="fas fa-arrow-left"></i> Back to Restaurants
            </button>
            <h2>${restaurant.name}</h2>
            <p class="cuisine">${restaurant.cuisine}</p>
            <div class="restaurant-meta">
                <span class="rating">⭐ ${restaurant.rating}</span>
                <span class="delivery-time">🕒 ${restaurant.deliveryTime}</span>
            </div>
        </div>
        <div class="menu-categories">
            <div class="main-categories">
                <button class="category-btn active" data-category="veg">Veg Menu</button>
                <button class="category-btn" data-category="nonveg">Non-Veg Menu</button>
            </div>
            <div class="sub-categories" id="vegSubCategories">
                <button class="sub-category-btn active" data-subcategory="veg-soups">Soups</button>
                <button class="sub-category-btn" data-subcategory="veg-starters">Starters</button>
                <button class="sub-category-btn" data-subcategory="veg-noodles">Noodles</button>
                <button class="sub-category-btn" data-subcategory="veg-main">Main Course</button>
                <button class="sub-category-btn" data-subcategory="desserts">Desserts</button>
            </div>
            <div class="sub-categories" id="nonvegSubCategories" style="display: none;">
                <button class="sub-category-btn active" data-subcategory="nonveg-soups">Soups</button>
                <button class="sub-category-btn" data-subcategory="nonveg-starters">Starters</button>
                <button class="sub-category-btn" data-subcategory="nonveg-noodles">Noodles</button>
                <button class="sub-category-btn" data-subcategory="nonveg-main">Main Course</button>
            </div>
        </div>
        <div class="menu-items" id="menuItems">
            <!-- Menu items will be displayed here -->
        </div>
    `;

    // Add menu container to the page
    const menuSection = document.querySelector('.menu-section');
    menuSection.innerHTML = '';
    menuSection.appendChild(menuContainer);

    // Function to display menu items
    function displayMenuItems(category) {
        const menuItemsContainer = document.getElementById('menuItems');
        const items = restaurant.menuItems.filter(item => item.category === category);
        
        console.log(`📋 Displaying ${items.length} items for category: ${category} in restaurant: ${restaurant.name}`);
        
        menuItemsContainer.innerHTML = items.map(item => `
            <div class="menu-item" onclick="openProductModal(${item.id})">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="item-price">₹${item.price}</div>
                </div>
            </div>
        `).join('');
    }

    // Add event listeners for main categories
    const mainCategoryBtns = menuContainer.querySelectorAll('.main-categories .category-btn');
    mainCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            mainCategoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide sub-categories
            const category = btn.dataset.category;
            document.getElementById('vegSubCategories').style.display = category === 'veg' ? 'flex' : 'none';
            document.getElementById('nonvegSubCategories').style.display = category === 'nonveg' ? 'flex' : 'none';

            // Update active sub-category button
            const subCategoryBtns = document.querySelectorAll(`#${category}SubCategories .sub-category-btn`);
            subCategoryBtns.forEach(b => b.classList.remove('active'));
            subCategoryBtns[0].classList.add('active');

            // Display items for the first sub-category
            displayMenuItems(subCategoryBtns[0].dataset.subcategory);
        });
    });

    // Add event listeners for sub-categories
    const subCategoryBtns = menuContainer.querySelectorAll('.sub-category-btn');
    subCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            const parentContainer = btn.closest('.sub-categories');
            parentContainer.querySelectorAll('.sub-category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Display items for the selected sub-category
            displayMenuItems(btn.dataset.subcategory);
        });
    });

    // Display initial items (Veg soups)
    displayMenuItems('veg-soups');
}

// Update openProductModal function to work with current restaurant context
function openProductModal(itemId) {
    console.log('🔍 openProductModal called with itemId:', itemId);
    
    // First, try to find the item in the current restaurant context
    let currentRestaurantId = getCurrentRestaurantId();
    let restaurant = restaurants.find(r => r.id === currentRestaurantId);
    let item = null;
    
    if (restaurant) {
        item = restaurant.menuItems.find(item => item.id === itemId);
        console.log('🔍 Looking in restaurant:', restaurant.name, 'for item ID:', itemId);
    }
    
    // If item not found in current restaurant, search all restaurants
    if (!item) {
        console.log('🔍 Item not found in current restaurant, searching all restaurants...');
        for (const r of restaurants) {
            const foundItem = r.menuItems.find(menuItem => menuItem.id === itemId);
            if (foundItem) {
                restaurant = r;
                item = foundItem;
                currentRestaurantId = r.id;
                console.log('✅ Found item in restaurant:', r.name);
                break;
            }
        }
    }
    
    if (item && restaurant) {
        console.log('✅ Found item:', item.name, 'in restaurant:', restaurant.name);
        
        // Set the current restaurant context
        setCurrentRestaurantId(currentRestaurantId);
        
        // Set the current product ID
        currentProductId = itemId;
        
        // Update modal content
        if (productModalImage) productModalImage.src = item.image;
        if (productModalName) productModalName.textContent = item.name;
        if (productModalDescription) productModalDescription.textContent = item.description;
        if (productModalPrice) productModalPrice.textContent = `₹${item.price}`;
        // Show dietary info for this product
        showDietaryInfoForProduct(item);
        
        // Add Order Now button to modal
        addOrderNowButton(item, restaurant);
        
        // Load reviews from localStorage
        loadReviewsFromLocalStorage(itemId);
        
        // Show the modal
        if (productModal) {
            productModal.classList.add('active');
            // Initialize feedback stars every time modal opens
            initializeFeedbackStars();
            // Attach submit review handler safely
            const submitBtn = document.getElementById('submitFeedback');
            if (submitBtn) {
                // Remove previous event listeners by cloning
                const newBtn = submitBtn.cloneNode(true);
                submitBtn.parentNode.replaceChild(newBtn, submitBtn);
                newBtn.addEventListener('click', function() {
                    const feedbackText = document.getElementById('feedbackText').value.trim();
                    const ratingStars = document.querySelectorAll('.feedback-stars i.fas');
                    const productId = currentProductId;
                    if (!feedbackText) {
                        showNotification('Please enter your review text');
                        return;
                    }
                    if (ratingStars.length === 0) {
                        showNotification('Please select a rating');
                        return;
                    }
                    if (!productId) {
                        showNotification('No product selected');
                        return;
                    }
                    if (!isLoggedIn || !currentUser) {
                        showNotification('Please login to submit a review');
                        openLoginModal();
                        return;
                    }
                    const rating = ratingStars.length;
                    try {
                        const review = {
                            id: Date.now(),
                            productId: productId,
                            userId: currentUser.id,
                            username: currentUser.name,
                            rating: rating,
                            reviewText: feedbackText,
                            created_at: new Date().toISOString()
                        };
                        const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
                        existingReviews.push(review);
                        localStorage.setItem('reviews', JSON.stringify(existingReviews));
                        document.getElementById('feedbackText').value = '';
                        resetStars();
                        showNotification('Review submitted successfully!');
                        loadReviewsFromLocalStorage(productId);
                    } catch (error) {
                        showNotification('Failed to submit review. Please try again.');
                    }
                });
            }
        } else {
            console.error('❌ Product modal element not found');
        }
    } else {
        console.error(`❌ Item with ID ${itemId} not found in any restaurant`);
        showNotification('Item not found. Please try again.');
    }
}

// Function to add Order Now button to product modal
function addOrderNowButton(item, restaurant) {
    let modalActions = document.querySelector('.modal-actions');
    if (!modalActions) {
        console.error('No .modal-actions container found in modal!');
        return;
    }
    modalActions.innerHTML = '';

    // Order Now button
    const orderNowBtn = document.createElement('button');
    orderNowBtn.className = 'order-now-btn';
    orderNowBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Order Now - ₹${item.price}`;
    orderNowBtn.style.cssText = `
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Add hover effects
    orderNowBtn.addEventListener('mouseenter', () => {
        orderNowBtn.style.transform = 'translateY(-2px)';
        orderNowBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
    });
    
    orderNowBtn.addEventListener('mouseleave', () => {
        orderNowBtn.style.transform = 'translateY(0)';
        orderNowBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
    });
    
    // Add click handler
    orderNowBtn.addEventListener('click', () => {
        handleOrderNow(item, restaurant);
    });
    
    // Add to Cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart-btn';
    addToCartBtn.innerHTML = `<i class="fas fa-plus"></i> Add to Cart`;
    addToCartBtn.style.cssText = `
        background: linear-gradient(135deg, #4ecdc4, #44a08d);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Add hover effects for Add to Cart button
    addToCartBtn.addEventListener('mouseenter', () => {
        addToCartBtn.style.transform = 'translateY(-2px)';
        addToCartBtn.style.boxShadow = '0 6px 20px rgba(78, 205, 196, 0.4)';
    });
    
    addToCartBtn.addEventListener('mouseleave', () => {
        addToCartBtn.style.transform = 'translateY(0)';
        addToCartBtn.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.3)';
    });
    
    // Add click handler for Add to Cart
    addToCartBtn.addEventListener('click', () => {
        addToCart(item.id);
        showNotification(`"${item.name}" added to cart! 🛒`);
    });
    
    // Add both buttons side by side
    modalActions.appendChild(orderNowBtn);
    modalActions.appendChild(addToCartBtn);
}

// Function to handle Order Now button click
function handleOrderNow(item, restaurant) {
    console.log('🛒 Order Now clicked for:', item.name);
    
    // Check if user is logged in
    if (!isLoggedIn || !currentUser) {
        showNotification('Please login to place an order!');
        openLoginModal();
        return;
    }
    
    // Create order object
    const order = {
        id: Date.now(),
        date: new Date(),
        status: 'Processing',
        items: [{
            name: item.name,
            price: item.price,
            image: item.image,
            restaurantName: restaurant.name
        }],
        total: item.price,
        restaurantName: restaurant.name
    };
    
    // Add order to user's order history
    if (!currentUser.orders) {
        currentUser.orders = [];
    }
    currentUser.orders.unshift(order);
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(currentUser));
    
    // Close the product modal
    if (productModal) {
        productModal.classList.remove('active');
    }
    
    // Show success message
    showNotification(`Order placed successfully! Your order #${order.id} is being processed. 🎉`);
    
    // Update profile display if profile modal is open
    updateProfileDisplay();
    
    // Optionally, you can redirect to order tracking or show order details
    setTimeout(() => {
        showOrderConfirmation(order);
    }, 1000);
}

// Function to show order confirmation
function showOrderConfirmation(order) {
    // Create order confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'order-confirmation-modal';
    confirmationModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    confirmationModal.innerHTML = `
        <div class="confirmation-content" style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        ">
            <div class="success-icon" style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #4ecdc4, #44a08d);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: white;
                font-size: 40px;
            ">
                <i class="fas fa-check"></i>
            </div>
            
            <h2 style="color: #333; margin-bottom: 10px;">Order Placed Successfully!</h2>
            <p style="color: #666; margin-bottom: 20px;">Your order has been confirmed and is being prepared.</p>
            
            <div class="order-details" style="
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            ">
                <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Order ID:</span>
                    <span style="font-weight: bold; color: #333;">#${order.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Restaurant:</span>
                    <span style="font-weight: bold; color: #333;">${order.restaurantName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Items:</span>
                    <span style="font-weight: bold; color: #333;">${order.items.length}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Total:</span>
                    <span style="font-weight: bold; color: #333;">₹${order.total}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">Status:</span>
                    <span style="font-weight: bold; color: #4ecdc4;">${order.status}</span>
                </div>
            </div>
            
            <div class="action-buttons" style="display: flex; gap: 10px; justify-content: center;">
                <button class="track-order-btn" style="
                    background: linear-gradient(135deg, #4ecdc4, #44a08d);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Track Order</button>
                <button class="close-confirmation-btn" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Close</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(confirmationModal);
    
    // Add event listeners
    const trackOrderBtn = confirmationModal.querySelector('.track-order-btn');
    const closeBtn = confirmationModal.querySelector('.close-confirmation-btn');
    
    trackOrderBtn.addEventListener('click', () => {
        confirmationModal.remove();
        // Open profile modal to show order history
        if (profileModal) {
            profileModal.classList.add('active');
            updateProfileDisplay();
        }
    });
    
    closeBtn.addEventListener('click', () => {
        confirmationModal.remove();
    });
    
    // Close on outside click
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.remove();
        }
    });
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (confirmationModal.parentNode) {
            confirmationModal.remove();
        }
    }, 10000);
}

// Helper function to get current restaurant ID
function getCurrentRestaurantId() {
    // Use the stored current restaurant ID
    const storedId = getStoredCurrentRestaurantId();
    console.log('🔍 getCurrentRestaurantId returning:', storedId);
    return storedId;
}

// Store and retrieve current restaurant ID
let currentRestaurantId = 1;

function setCurrentRestaurantId(restaurantId) {
    console.log('🔧 Setting current restaurant ID to:', restaurantId);
    currentRestaurantId = restaurantId;
}

function getStoredCurrentRestaurantId() {
    console.log('🔍 getStoredCurrentRestaurantId returning:', currentRestaurantId);
    return currentRestaurantId;
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    // Update cart count
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '₹0';
        
        // Update cart actions for empty cart
        updateCartActions();
        return;
    }
    
    // Group items by restaurant
    const groupedItems = cart.reduce((acc, item) => {
        if (!acc[item.restaurantName]) {
            acc[item.restaurantName] = [];
        }
        acc[item.restaurantName].push(item);
        return acc;
    }, {});
    
    // Generate cart HTML
    let cartHTML = '';
    let total = 0;
    
    for (const [restaurantName, items] of Object.entries(groupedItems)) {
        cartHTML += `
            <div class="cart-restaurant">
                <h3>${restaurantName}</h3>
                <div class="cart-items-container">
                    ${items.map(item => {
                        total += item.price;
                        return `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p>₹${item.price}</p>
                                </div>
                                <div class="cart-item-actions">
                                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = `₹${total}`;
    
    // Update cart actions
    updateCartActions();
}

// Function to update cart actions (buttons)
function updateCartActions() {
    const cartActions = document.querySelector('.cart-actions');
    
    if (!cartActions) {
        console.error('Cart actions container not found');
        return;
    }
    
    if (cart.length === 0) {
        // Empty cart - show only clear cart button
        cartActions.innerHTML = `
            <button id="clearCartBtn" class="clear-cart-btn">
                <i class="fas fa-trash"></i> Clear Cart
            </button>
        `;
    } else {
        // Cart has items - show all action buttons
        cartActions.innerHTML = `
            <button id="clearCartBtn" class="clear-cart-btn">
                <i class="fas fa-trash"></i> Clear Cart
            </button>
            <button id="orderNowBtn" class="order-now-btn">
                <i class="fas fa-shopping-cart"></i> Order Now - ₹${cart.reduce((sum, item) => sum + item.price, 0)}
            </button>
            <button id="checkoutBtn" class="checkout-btn">
                <i class="fas fa-credit-card"></i> Checkout
            </button>
        `;
        
        // Add event listeners for the new buttons
        const orderNowBtn = document.getElementById('orderNowBtn');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (orderNowBtn) {
            orderNowBtn.addEventListener('click', handleCartOrderNow);
        }
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }
}

// Function to handle Order Now from cart
function handleCartOrderNow() {
    console.log('🛒 Order Now clicked from cart');
    
    // Check if user is logged in
    if (!isLoggedIn || !currentUser) {
        showNotification('Please login to place an order!');
        openLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Group items by restaurant for multiple orders
    const groupedItems = cart.reduce((acc, item) => {
        if (!acc[item.restaurantName]) {
            acc[item.restaurantName] = [];
        }
        acc[item.restaurantName].push(item);
        return acc;
    }, {});
    
    // Create orders for each restaurant
    const orders = [];
    for (const [restaurantName, items] of Object.entries(groupedItems)) {
        const order = {
            id: Date.now() + Math.random(), // Ensure unique ID
            date: new Date(),
            status: 'Processing',
            items: items.map(item => ({
                name: item.name,
                price: item.price,
                image: item.image,
                restaurantName: restaurantName
            })),
            total: items.reduce((sum, item) => sum + item.price, 0),
            restaurantName: restaurantName
        };
        orders.push(order);
    }
    
    // Add orders to user's order history
    if (!currentUser.orders) {
        currentUser.orders = [];
    }
    
    // Add all orders to the beginning of the order history
    orders.forEach(order => {
        currentUser.orders.unshift(order);
    });
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(currentUser));
    
    // Clear the cart
    clearCart();
    
    // Close the cart modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
    
    // Show success message
    const totalItems = cart.length;
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    showNotification(`Order placed successfully! ${totalItems} items ordered for ₹${totalAmount}. 🎉`);
    
    // Update profile display if profile modal is open
    updateProfileDisplay();
    
    // Show order confirmation for the first order (or create a combined confirmation)
    setTimeout(() => {
        if (orders.length === 1) {
            showOrderConfirmation(orders[0]);
        } else {
            showMultipleOrderConfirmation(orders);
        }
    }, 1000);
}

// Function to show confirmation for multiple orders
function showMultipleOrderConfirmation(orders) {
    // Create order confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'order-confirmation-modal';
    confirmationModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
    const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
    
    confirmationModal.innerHTML = `
        <div class="confirmation-content" style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        ">
            <div class="success-icon" style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #4ecdc4, #44a08d);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: white;
                font-size: 40px;
            ">
                <i class="fas fa-check"></i>
            </div>
            
            <h2 style="color: #333; margin-bottom: 10px;">Orders Placed Successfully!</h2>
            <p style="color: #666; margin-bottom: 20px;">Your orders have been confirmed and are being prepared.</p>
            
            <div class="order-summary" style="
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            ">
                <h3 style="color: #333; margin-bottom: 15px;">Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Total Orders:</span>
                    <span style="font-weight: bold; color: #333;">${orders.length}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Total Items:</span>
                    <span style="font-weight: bold; color: #333;">${totalItems}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666;">Total Amount:</span>
                    <span style="font-weight: bold; color: #333;">₹${totalAmount}</span>
                </div>
            </div>
            
            <div class="restaurant-orders" style="
                max-height: 200px;
                overflow-y: auto;
                margin: 20px 0;
                text-align: left;
            ">
                <h4 style="color: #333; margin-bottom: 10px;">Orders by Restaurant:</h4>
                ${orders.map(order => `
                    <div style="
                        background: #e9ecef;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <strong style="color: #333;">${order.restaurantName}</strong>
                            <div style="color: #666; font-size: 12px;">Order #${order.id}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: #333;">₹${order.total}</div>
                            <div style="color: #666; font-size: 12px;">${order.items.length} items</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="action-buttons" style="display: flex; gap: 10px; justify-content: center;">
                <button class="track-order-btn" style="
                    background: linear-gradient(135deg, #4ecdc4, #44a08d);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Track Orders</button>
                <button class="close-confirmation-btn" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Close</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(confirmationModal);
    
    // Add event listeners
    const trackOrderBtn = confirmationModal.querySelector('.track-order-btn');
    const closeBtn = confirmationModal.querySelector('.close-confirmation-btn');
    
    trackOrderBtn.addEventListener('click', () => {
        confirmationModal.remove();
        // Open profile modal to show order history
        if (profileModal) {
            profileModal.classList.add('active');
            updateProfileDisplay();
        }
    });
    
    closeBtn.addEventListener('click', () => {
        confirmationModal.remove();
    });
    
    // Close on outside click
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.remove();
        }
    });
    
    // Auto close after 15 seconds
    setTimeout(() => {
        if (confirmationModal.parentNode) {
            confirmationModal.remove();
        }
    }, 15000);
}

// Function to add item to cart
function addToCart(itemId) {
    // Get the current restaurant from the menu display context
    const currentRestaurantId = getCurrentRestaurantId();
    console.log('🛒 addToCart called with itemId:', itemId, 'currentRestaurantId:', currentRestaurantId);
    
    const restaurant = restaurants.find(r => r.id === currentRestaurantId);
    if (!restaurant) {
        console.error('❌ No restaurant context found for addToCart');
        return;
    }

    const item = restaurant.menuItems.find(item => item.id === itemId);
    if (item) {
        console.log('✅ Adding item to cart:', item.name, 'from restaurant:', restaurant.name);
        cart.push({
            ...item,
            restaurantName: restaurant.name
        });
        updateCartDisplay();
        showNotification(`"${item.name}" added to cart successfully! 🛒`);
    } else {
        console.error(`❌ Item with ID ${itemId} not found in restaurant ${restaurant.name} for addToCart`);
    }
}

// Function to remove item from cart
function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        updateCartDisplay();
        showNotification(`"${removedItem.name}" removed from cart successfully! 🗑️`);
    }
}

// Function to clear cart
function clearCart() {
    cart = [];
    updateCartDisplay();
    showNotification('Cart cleared successfully! 🧹');
}

// Function to handle checkout
function handleCheckout() {
    if (!isLoggedIn) {
        showNotification('Please login to place an order!');
        loginModal.classList.add('active');
        return;
    }
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    // Open payment modal instead of placing order immediately
    openPaymentModal();
    // After payment, place the order (see paymentForm handler below)
}

// Show notification
function showNotification(message) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles to ensure visibility
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.5s ease-out';
    
    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds with fade out animation
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Cart Order Now Button Styles */
    .cart-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .order-now-btn {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
        color: white !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 25px !important;
        font-size: 16px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3) !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        min-width: 180px !important;
        justify-content: center !important;
    }
    
    .order-now-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4) !important;
    }
    
    .clear-cart-btn {
        background: linear-gradient(135deg, #6c757d, #495057) !important;
        color: white !important;
        border: none !important;
        padding: 12px 20px !important;
        border-radius: 25px !important;
        font-size: 14px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3) !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    
    .clear-cart-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4) !important;
    }
    
    .checkout-btn {
        background: linear-gradient(135deg, #4ecdc4, #44a08d) !important;
        color: white !important;
        border: none !important;
        padding: 12px 20px !important;
        border-radius: 25px !important;
        font-size: 14px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3) !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    
    .checkout-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4) !important;
    }
    
    /* Responsive design for cart actions */
    @media (max-width: 768px) {
        .cart-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .order-now-btn,
        .clear-cart-btn,
        .checkout-btn {
            width: 100%;
            max-width: 300px;
        }
    }
`;
document.head.appendChild(style);

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully!');
        contactForm.reset();
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you for subscribing!');
        newsletterForm.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const selector = this.getAttribute('href');
        // Only scroll if selector is not just '#'
        if (selector && selector !== '#') {
            const target = document.querySelector(selector);
            if (target) {
                target.scrollIntoView({
            behavior: 'smooth'
        });
            }
        }
    });
});

// Show login modal with animation
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Close login modal with animation
closeLogin.addEventListener('click', () => {
    if (!isLoggedIn) {
        showNotification('Please login to continue');
        return;
    }
    loginModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close modal when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal && !isLoggedIn) {
        showNotification('Please login to continue');
        return;
    }
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Tab switching with animation
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        loginForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        const formId = btn.dataset.tab + 'LoginForm';
        document.getElementById(formId).classList.add('active');
    });
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

// Show error animation
function showError(input) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 500);
}

// Add this function to handle user login
function handleUserLogin(userData) {
    // Set user data and login state
    currentUser = {
        id: 1,
        name: 'prasanna',
        email: 'prasannadasari006@gmail.com',
        phone: '9701690259',
        avatar: 'https://via.placeholder.com/100',
        addresses: [],
        orders: [],
        password: 'Devi1413'
    };
    ensureUserFields(currentUser);
    isLoggedIn = true;
    
    // Update UI for logged in state
    updateLoginState();
    
    // Show main content and initialize features
    const mainContent = document.querySelector('.menu-section');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    displayRestaurants();
    initializeFeatures();
    
    showNotification('Login successful!');
    loginModal.classList.remove('active');
    document.body.style.overflow = '';
    // --- Feature UI updates ---
    updateLoyaltyPointsDisplay();
    renderFavoritesTab();
    renderOrderTimeline();
    renderFavoriteIcons();
}

// Add password visibility toggle functionality
function initializePasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        // Create eye icon container
        const eyeContainer = document.createElement('div');
        eyeContainer.className = 'password-toggle';
        eyeContainer.innerHTML = '<i class="fas fa-eye"></i>';
        
        // Style the container
        eyeContainer.style.position = 'absolute';
        eyeContainer.style.right = '10px';
        eyeContainer.style.top = '50%';
        eyeContainer.style.transform = 'translateY(-50%)';
        eyeContainer.style.cursor = 'pointer';
        eyeContainer.style.color = '#666';
        eyeContainer.style.padding = '5px';
        eyeContainer.style.zIndex = '2';
        
        // Add click event to toggle password visibility
        eyeContainer.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            if (input.type === 'password') {
                input.type = 'text';
                eyeContainer.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                eyeContainer.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
        
        // Add the eye icon to the input's parent
        const inputWrapper = document.createElement('div');
        inputWrapper.style.position = 'relative';
        inputWrapper.style.width = '100%';
        input.parentNode.insertBefore(inputWrapper, input);
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(eyeContainer);
        
        // Add styles to the password input
        input.style.paddingRight = '35px';
        input.style.width = '100%';
    });
}


// Modify phone login form submission
phoneLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Phone login form submitted');
    
    const phoneInput = phoneLoginForm.querySelector('input[type="tel"]');
    const otpInput = phoneLoginForm.querySelector('input[type="text"]').value;
    
    console.log('Phone:', phoneInput.value);
    console.log('OTP:', otpInput.value);
    
    // Check credentials
    if (phoneInput.value === '9701690259') {
        console.log('Login successful');
        handleSuccessfulLogin();
        
        // Clear the form
        this.reset();
    } else {
        console.log('Login failed');
        showNotification('Invalid phone number');
        this.querySelector('input[type="text"]').value = '';
    }
});

// Send OTP with validation
sendOtpBtn.addEventListener('click', () => {
    console.log('Send OTP button clicked');
    
    const phoneInput = phoneLoginForm.querySelector('input[type="tel"]');
    console.log('Phone number for OTP:', phoneInput.value);
    
    if (phoneInput.value === '9701690259') {
        console.log('OTP sent for valid phone number');
        showNotification('OTP sent successfully!');
        
        // Enable the OTP input field
        const otpInput = phoneLoginForm.querySelector('input[type="text"]');
        otpInput.disabled = false;
        otpInput.focus();
    } else {
        console.log('Invalid phone number for OTP');
        showNotification('Invalid phone number');
    }
});

// Close product modal
closeProduct.addEventListener('click', () => {
    productModal.classList.remove('active');
    currentProductId = null;
});

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('active');
        currentProductId = null;
    }
});

// Calculate average rating
function calculateAverageRating(feedback) {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / feedback.length;
}

// Update rating display
function updateRatingDisplay(rating) {
    const stars = document.querySelectorAll('.product-rating .stars i');
    stars.forEach((star, index) => {
        if (index < Math.floor(rating)) {
            star.className = 'fas fa-star';
        } else if (index < Math.ceil(rating)) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
    });
    document.querySelector('.rating-count').textContent = `(${restaurants.find(r => r.menuItems.some(item => item.id === currentProductId)).menuItems.find(item => item.id === currentProductId).feedback.length} ratings)`;
}

// Display feedback
function displayFeedback(feedback) {
    feedbackList.innerHTML = feedback.map(item => `
        <div class="feedback-item">
            <div class="feedback-header">
                <div class="feedback-rating">
                    ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                </div>
                <span class="feedback-date">${new Date(item.date).toLocaleDateString()}</span>
            </div>
            <p>${item.text}</p>
            ${item.image ? `<img src="${item.image}" alt="Customer photo" style="max-width: 200px; margin-top: 0.5rem;">` : ''}
        </div>
    `).join('');
}

// Function to save review to localStorage
function saveReview(productId, review) {
    try {
        // Get existing reviews from localStorage
        const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        const newReview = {
            id: Date.now(),
            productId: productId,
            userId: currentUser ? currentUser.id : 1,
            username: currentUser ? currentUser.name : 'Anonymous',
            rating: review.rating,
            reviewText: review.text,
            created_at: new Date().toISOString()
        };
        
        existingReviews.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(existingReviews));
        
        return newReview;
    } catch (error) {
        console.error('Error saving review:', error);
        throw error;
    }
}

// Function to load reviews from localStorage
function loadReviewsFromLocalStorage(productId) {
    try {
        console.log('📥 Loading reviews from localStorage for product:', productId);
        
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const productReviews = reviews.filter(review => review.productId === productId);
        
        console.log('✅ Reviews loaded from localStorage:', productReviews);
        
        // Update the feedback display
        displayFeedbackFromDatabase(productReviews);
        
        // Update the rating display
        const averageRating = productReviews.length > 0 
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
            : 0;
        updateRatingDisplay(averageRating);
        
    } catch (error) {
        console.error('❌ Error loading reviews from localStorage:', error);
        
        // Set default rating and empty feedback on error
        updateRatingDisplay(0);
        const feedbackList = document.getElementById('feedbackList');
        if (feedbackList) {
            feedbackList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>';
        }
    }
}

// Function to display feedback from database
function displayFeedbackFromDatabase(reviews) {
    const feedbackList = document.getElementById('feedbackList');
    
    if (reviews.length === 0) {
        feedbackList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    feedbackList.innerHTML = reviews.map(review => `
        <div class="feedback-item">
            <div class="feedback-header">
                <span class="feedback-user">${review.username}</span>
                <div class="feedback-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <span class="feedback-date">${new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p class="feedback-text">${review.reviewText}</p>
        </div>
    `).join('');
}

// Function to reset stars
function resetStars() {
    document.querySelectorAll('.feedback-stars i').forEach(star => {
        star.className = 'far fa-star';
    });
}

// Function to display reviews
async function displayReviews(productId) {
    const feedbackList = document.getElementById('feedbackList');
    try {
        const reviews = await loadReviews(productId);
        
        feedbackList.innerHTML = reviews.map(review => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <span class="feedback-user">${review.username}</span>
                    <div class="feedback-stars">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                </div>
                <p class="feedback-text">${review.review_text}</p>
                <span class="feedback-date">${new Date(review.created_at).toLocaleDateString()}</span>
            </div>
        `).join('');
    } catch (error) {
        feedbackList.innerHTML = '<p>Error loading reviews. Please try again later.</p>';
    }
}

// Handle feedback stars
document.querySelectorAll('.feedback-stars i').forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        // Update all stars
        document.querySelectorAll('.feedback-stars i').forEach(s => {
            const starRating = parseInt(s.dataset.rating);
            if (starRating <= rating) {
                s.className = 'fas fa-star active';
            } else {
                s.className = 'far fa-star';
            }
        });
    });
});

// Handle image upload preview
customerImage.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Remove any existing preview
            const existingPreview = document.querySelector('.image-preview-container');
            if (existingPreview) {
                existingPreview.remove();
            }

            // Create preview container
            const previewContainer = document.createElement('div');
            previewContainer.className = 'image-preview-container';
            
            // Create image element
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            
            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remove image';
            
            // Add click handler to remove button
            removeBtn.addEventListener('click', () => {
                previewContainer.remove();
                customerImage.value = ''; // Clear the file input
            });
            
            // Add elements to container
            previewContainer.appendChild(img);
            previewContainer.appendChild(removeBtn);
            
            // Add container to image upload section
            const container = document.querySelector('.image-upload');
            container.appendChild(previewContainer);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Handle modal add to cart
modalAddToCart.addEventListener('click', () => {
    if (currentProductId) {
        addToCart(currentProductId);
    }
});

// Social Login Buttons
document.querySelectorAll('.social-btn.google').forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            // Show loading state
            btn.classList.add('loading');
            btn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Here you would typically implement Google OAuth
            console.log('Google login attempt');
            showNotification('Google login functionality will be implemented soon!');
        } catch (error) {
            showNotification('Google login failed. Please try again.');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });
});

document.querySelectorAll('.social-btn.facebook').forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            // Show loading state
            btn.classList.add('loading');
            btn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Here you would typically implement Facebook OAuth
            console.log('Facebook login attempt');
            showNotification('Facebook login functionality will be implemented soon!');
        } catch (error) {
            showNotification('Facebook login failed. Please try again.');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });
});


// Function to perform search
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        displayRestaurants();
        return;
    }

    const searchResults = {
        restaurants: [],
        menuItems: []
    };

    // Search through restaurants and menu items
    restaurants.forEach(restaurant => {
        // Check restaurant name and cuisine
        if (restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm)) {
            searchResults.restaurants.push(restaurant);
        }

        // Check menu items
        restaurant.menuItems.forEach(item => {
            if (item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)) {
                searchResults.menuItems.push({
                    ...item,
                    restaurantName: restaurant.name,
                    restaurantId: restaurant.id
                });
            }
        });
    });

    const restaurantsSection = document.querySelector('.menu-section');
    
    // If no results found
    if (searchResults.restaurants.length === 0 && searchResults.menuItems.length === 0) {
        restaurantsSection.innerHTML = `
            <div class="no-results">
                <h2>No results found for "${searchTerm}"</h2>
                <button onclick="displayRestaurants()" class="back-btn">Back to Restaurants</button>
            </div>
        `;
        return;
    }

    // Display search results
    let searchHTML = `<h2>Search Results for "${searchTerm}"</h2>`;

    // Display restaurants if found
    if (searchResults.restaurants.length > 0) {
        searchHTML += `
            <h3>Restaurants</h3>
            <div class="restaurants-grid">
                ${searchResults.restaurants.map(restaurant => `
                    <div class="restaurant-card" onclick="displayRestaurantMenu(${restaurant.id})">
                        <img src="${restaurant.image}" alt="${restaurant.name}">
                        <div class="restaurant-info">
                            <h3>${restaurant.name}</h3>
                            <p class="cuisine">${restaurant.cuisine}</p>
                            <div class="restaurant-meta">
                                <span class="rating">⭐ ${restaurant.rating}</span>
                                <span class="delivery-time">🕒 ${restaurant.deliveryTime}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Display menu items if found
    if (searchResults.menuItems.length > 0) {
        searchHTML += `
            <h3>Menu Items</h3>
            <div class="menu-grid">
                ${searchResults.menuItems.map(item => `
                    <div class="menu-item" onclick="openProductModal(${item.id})" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="menu-item-content">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <div class="menu-item-footer">
                                <span class="price">₹${item.price}</span>
                                <span class="restaurant-name">${item.restaurantName}</span>
                            </div>
                        </div>
                        <div class="menu-item-actions">
                            <button 
                                onclick="event.stopPropagation(); handleOrderNowFromSearch(${item.id}, '${item.restaurantName.replace(/'/g, "\\'")}')"
                                class="order-now-btn"
                                style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer;">
                                <i class="fas fa-shopping-cart"></i> Order Now
                            </button>
                            <button 
                                onclick="event.stopPropagation(); addToCartFromSearch(${item.id}, '${item.restaurantName.replace(/'/g, "\\'")}')"
                                class="add-to-cart-btn"
                                style="background: linear-gradient(135deg, #4ecdc4, #44a08d); color: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer;">
                                <i class="fas fa-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    restaurantsSection.innerHTML = searchHTML;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Check if user is already logged in
    const isAlreadyLoggedIn = checkStoredLogin();
    
    // If not already logged in, check login status and show/hide content accordingly
    if (!isAlreadyLoggedIn) {
        checkLoginStatusAndUpdateUI();
    }
});

// Create a function to initialize all features
function initializeFeatures() {
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) {
        searchInput.addEventListener('input', performSearch);
        searchBtn.addEventListener('click', performSearch);
    }

    initializeCart();
    initializeSlideshow();
    
    // Initialize profile functionality
    initializeProfile();
}

// Function to initialize cart functionality
function initializeCart() {
    console.log('🛒 Initializing cart functionality');
    
    // Add event listeners for cart buttons
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCart = document.getElementById('closeCart');
    const cartModal = document.getElementById('cartModal');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    console.log('✅ Cart functionality initialized');
}

// Function to add order to history
function addOrderToHistory(order) {
    if (!currentUser) return;
    currentUser.orders.unshift({
        id: Date.now(),
        date: new Date(),
        status: 'Pending',
        items: order.items,
        total: order.total
    });
    updateProfileDisplay();
    // --- Feature UI updates ---
    updateLoyaltyPointsDisplay();
    renderOrderTimeline();
    startOrderTracking(currentUser.orders[0]);
    renderFavoriteIcons();
}

// Function to display order history
function displayOrderHistory() {
    if (!orderHistory || !currentUser) return;

    if (currentUser.orders.length === 0) {
        orderHistory.innerHTML = '<p class="no-data">No orders found</p>';
        return;
    }

    orderHistory.innerHTML = currentUser.orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-item-details">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-price">₹${item.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: ₹${order.total}</div>
        </div>
    `).join('');
}

// Function to display addresses
function displayAddresses() {
    if (!addressList || !currentUser) return;

    if (currentUser.addresses.length === 0) {
        addressList.innerHTML = '<p class="no-data">No addresses found</p>';
        return;
    }

    addressList.innerHTML = currentUser.addresses.map(address => `
        <div class="address-card">
            <div class="address-name">${address.name}</div>
            <div class="address-details">
                ${address.street}<br>
                ${address.city}, ${address.state} ${address.pincode}<br>
                ${address.landmark ? `Landmark: ${address.landmark}` : ''}
            </div>
            <div class="address-actions">
                <button class="address-action-btn edit-address" data-id="${address.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="address-action-btn delete-address" data-id="${address.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners for address actions
    document.querySelectorAll('.edit-address').forEach(btn => {
        btn.addEventListener('click', () => editAddress(btn.dataset.id));
    });

    document.querySelectorAll('.delete-address').forEach(btn => {
        btn.addEventListener('click', () => deleteAddress(btn.dataset.id));
    });
}

// Function to add new address
function addAddress(addressData) {
    const newAddress = {
        id: Date.now(),
        ...addressData
    };
    currentUser.addresses.push(newAddress);
    displayAddresses();
    showNotification('Address added successfully!');
}

// Function to edit address
function editAddress(addressId) {
    const address = currentUser.addresses.find(addr => addr.id === parseInt(addressId));
    if (address) {
        // Populate address form
        document.getElementById('addressName').value = address.name;
        document.getElementById('streetAddress').value = address.street;
        document.getElementById('city').value = address.city;
        document.getElementById('state').value = address.state;
        document.getElementById('pincode').value = address.pincode;
        document.getElementById('landmark').value = address.landmark || '';
        
        // Show address modal
        addressModal.classList.add('active');
        
        // Update form submission handler
        addressForm.onsubmit = (e) => {
            e.preventDefault();
            const updatedAddress = {
                id: address.id,
                name: document.getElementById('addressName').value,
                street: document.getElementById('streetAddress').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                landmark: document.getElementById('landmark').value
            };
            
            const index = currentUser.addresses.findIndex(addr => addr.id === address.id);
            if (index !== -1) {
                currentUser.addresses[index] = updatedAddress;
                displayAddresses();
                addressModal.classList.remove('active');
                showNotification('Address updated successfully!');
            }
        };
    }
}

// Function to delete address
function deleteAddress(addressId) {
    if (confirm('Are you sure you want to delete this address?')) {
        currentUser.addresses = currentUser.addresses.filter(addr => addr.id !== parseInt(addressId));
        displayAddresses();
        showNotification('Address deleted successfully!');
    }
}

// Function to update login state in UI
function updateLoginState() {
    const loginBtn = document.getElementById('loginBtn');
    if (isLoggedIn && currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = () => {
            profileModal.classList.add('active');
            updateProfileDisplay();
        };
    } else {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> Login`;
        loginBtn.onclick = () => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }
}

// Function to handle logout
function handleLogout() {
    // Clear stored token
    localStorage.removeItem('authToken');
    
    currentUser = null;
    isLoggedIn = false;
    updateLoginState();
    
    // Hide main content and show login required screen
    const mainContent = document.querySelector('.main-content');
    const loginRequired = document.getElementById('loginRequired');
    
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    if (loginRequired) {
        loginRequired.style.display = 'flex';
    }
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    showNotification('Logged out successfully!');
}

// Add this function to check login status
function checkLoginStatus() {
    if (!isLoggedIn || !currentUser) {
        // Hide main content and show login required screen
        const mainContent = document.querySelector('.main-content');
        const loginRequired = document.getElementById('loginRequired');
        
        if (mainContent) {
            mainContent.style.display = 'none';
        }
        if (loginRequired) {
            loginRequired.style.display = 'flex';
        }
        
        return false;
    }
    return true;
}

// Initialize Profile Functionality
function initializeProfile() {
    console.log('Initializing profile');
    updateProfileDisplay();
    updateDeliveryTracking();
    
    // Set up delivery status updates (simulate real-time updates)
    setInterval(() => {
        const statusPoints = document.querySelectorAll('.status-point');
        const currentStatus = document.querySelector('.status-point.active');
        const currentIndex = Array.from(statusPoints).indexOf(currentStatus);
        
        if (currentIndex < statusPoints.length - 1) {
            statusPoints[currentIndex].classList.remove('active');
            statusPoints[currentIndex + 1].classList.add('active');
        }
    }, 30000); // Update every 30 seconds (for demo purposes)
}

// Function to update delivery tracking
function updateDeliveryTracking() {
    console.log('Updating delivery tracking');
    
    // Get delivery elements
    const deliveryAddress = document.getElementById('deliveryAddress');
    const estimatedTime = document.getElementById('estimatedTime');
    const riderName = document.getElementById('riderName');
    const riderPhone = document.getElementById('riderPhone');
    const riderImage = document.getElementById('riderImage');
    const statusPoints = document.querySelectorAll('.status-point');
    
    // Simulate delivery data (replace with actual API call in production)
    const deliveryData = {
        address: "123 Food Street, Cuisine City, FC 12345",
        estimatedTime: "25-30 minutes",
        rider: {
            name: "John Doe",
            phone: "+91 98765 43210",
            image: "https://via.placeholder.com/50"
        },
        status: "confirmed" // can be: confirmed, onTheWay, delivered
    };
    
    // Update delivery information
    if (deliveryAddress) deliveryAddress.textContent = deliveryData.address;
    if (estimatedTime) estimatedTime.textContent = deliveryData.estimatedTime;
    if (riderName) riderName.textContent = deliveryData.rider.name;
    if (riderPhone) riderPhone.textContent = deliveryData.rider.phone;
    if (riderImage) riderImage.src = deliveryData.rider.image;
    
    // Update status points
    statusPoints.forEach((point, index) => {
        point.classList.remove('active');
        if (index === 0 && deliveryData.status === 'confirmed') {
            point.classList.add('active');
        } else if (index === 1 && deliveryData.status === 'onTheWay') {
            point.classList.add('active');
        } else if (index === 2 && deliveryData.status === 'delivered') {
            point.classList.add('active');
        }
    });
}

// Profile button click handler
const profileBtn = document.querySelector('.login-button');
if (profileBtn) {
    console.log('Profile button found');
    profileBtn.addEventListener('click', () => {
        console.log('Profile button clicked');
        console.log('Login status:', isLoggedIn);
        
        if (isLoggedIn) {
            console.log('Opening profile modal');
            profileModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateProfileDisplay();
        } else {
            console.log('Opening login modal');
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
} else {
    console.log('Profile button not found');
}

// Initialize password toggle when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePasswordToggle();
    // ... rest of your initialization code
    loadChatHistory();

    const chatCloseBtn = document.getElementById('chatCloseBtn');
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleChatWidget();
        });
    }
});

// Open cart modal when clicking cart icon
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close cart modal when clicking close button
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close cart modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Simple test function to manually trigger login
function manualLoginTest() {
    console.log('🧪 Manual login test...');
    
    // Simulate the exact values that should work
    const testEmail = 'prasannadasari006@gmail.com';
    const testPassword = 'Devi1413';
    
    console.log('📧 Testing with email:', testEmail);
    console.log('🔑 Testing with password:', testPassword);
    
    // Direct comparison test
    const emailMatch = testEmail === 'prasannadasari006@gmail.com';
    const passwordMatch = testPassword === 'Devi1413';
    
    console.log('📧 Email matches:', emailMatch);
    console.log('🔑 Password matches:', passwordMatch);
    
    if (emailMatch && passwordMatch) {
        console.log('✅ Credentials are valid, triggering login...');
        
        // Set the global variables
        isLoggedIn = true;
        currentUser = {
            id: 1,
            name: 'prasanna',
            email: 'prasannadasari006@gmail.com',
            phone: '9701690259',
            avatar: 'https://via.placeholder.com/100',
            addresses: [],
            orders: []
        };
        
        // Update UI
        updateLoginState();
        checkLoginStatusAndUpdateUI();
        
        // Show success message
        showNotification('Manual login successful!');
        
        // Close login modal if open
        const loginModal = document.getElementById('loginModal');
        if (loginModal && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Display restaurants and initialize features
        displayRestaurants();
        initializeFeatures();
        
        console.log('🎉 Manual login completed successfully!');
    } else {
        console.error('❌ Credential validation failed');
    }
}

// Make manual test available globally
window.manualLoginTest = manualLoginTest;

// Test function for submit feedback
function testSubmitFeedback() {
    console.log('🧪 Testing submit feedback functionality...');
    
    const submitBtn = document.getElementById('submitFeedback');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackStars = document.querySelectorAll('.feedback-stars i');
    
    console.log('📝 Submit button found:', !!submitBtn);
    console.log('📝 Feedback text area found:', !!feedbackText);
    console.log('⭐ Feedback stars found:', feedbackStars.length);
    
    if (submitBtn && feedbackText && feedbackStars.length > 0) {
        console.log('✅ All feedback elements found');
        
        // Test star clicking
        console.log('⭐ Testing star clicking...');
        feedbackStars[0].click();
        
        // Test text input
        console.log('📝 Testing text input...');
        feedbackText.value = 'This is a test review';
        
        console.log('✅ Feedback test setup complete');
        console.log('📝 You can now click "Submit Review" to test');
    } else {
        console.error('❌ Some feedback elements not found');
    }
}

// Make test function globally available
window.testSubmitFeedback = testSubmitFeedback;

// Function to check if user is already logged in using stored token
function checkStoredLogin() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('No stored token found');
        return false;
    }
    
    try {
        // Check if we have user data in localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            console.log('✅ User data found in localStorage:', user);
            
            // Set user data
            currentUser = user;
            isLoggedIn = true;
            
            // Update UI
            updateLoginState();
            checkLoginStatusAndUpdateUI();
            
            // Display restaurants and initialize features
            displayRestaurants();
            initializeFeatures();
            
            return true;
        } else {
            console.log('❌ No user data found in localStorage');
            localStorage.removeItem('authToken');
            return false;
        }
    } catch (error) {
        console.error('❌ Error checking stored login:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        return false;
    }
}

// Function to load reviews (for compatibility)
function loadReviews(productId) {
    try {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        return reviews.filter(review => review.productId === productId);
    } catch (error) {
        console.error('Error loading reviews:', error);
        return [];
    }
}

// Modify the submit feedback handler
document.getElementById('submitFeedback').addEventListener('click', function() {
    console.log('📝 Submit feedback button clicked');
    
    const feedbackText = document.getElementById('feedbackText').value.trim();
    const ratingStars = document.querySelectorAll('.feedback-stars i.fas');
    const productId = currentProductId;
    
    console.log('📝 Feedback text:', feedbackText);
    console.log('⭐ Rating stars:', ratingStars.length);
    console.log('🆔 Product ID:', productId);
    
    if (!feedbackText) {
        showNotification('Please enter your review text');
        return;
    }
    
    if (ratingStars.length === 0) {
        showNotification('Please select a rating');
        return;
    }
    
    if (!productId) {
        showNotification('No product selected');
        return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn || !currentUser) {
        showNotification('Please login to submit a review');
        openLoginModal();
        return;
    }
    
    // Get the rating from the number of filled stars
    const rating = ratingStars.length;
    
    console.log('✅ Submitting review with rating:', rating);
    
    try {
        // Save review to localStorage instead of database
        const review = {
            id: Date.now(),
            productId: productId,
            userId: currentUser.id,
            username: currentUser.name,
            rating: rating,
            reviewText: feedbackText,
            created_at: new Date().toISOString()
        };
        
        // Get existing reviews from localStorage
        const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        existingReviews.push(review);
        localStorage.setItem('reviews', JSON.stringify(existingReviews));
        
        console.log('✅ Review saved locally:', review);
        
        // Clear the form
        document.getElementById('feedbackText').value = '';
        resetStars();
        
        // Show success message
        showNotification('Review submitted successfully!');
        
        // Reload reviews from localStorage
        loadReviewsFromLocalStorage(productId);
        
    } catch (error) {
        console.error('❌ Review submission error:', error);
        showNotification('Failed to submit review. Please try again.');
    }
});

function addToCartFromSearch(itemId, restaurantName) {
    // Find the restaurant and item
    const restaurant = restaurants.find(r => r.name === restaurantName);
    if (!restaurant) return showNotification('Restaurant not found!');
    const item = restaurant.menuItems.find(i => i.id === itemId);
    if (!item) return showNotification('Item not found!');
    cart.push({ ...item, restaurantName });
    updateCartDisplay();
    showNotification(`"${item.name}" added to cart!`);
}

function handleOrderNowFromSearch(itemId, restaurantName) {
    // Find the restaurant and item
    const restaurant = restaurants.find(r => r.name === restaurantName);
    if (!restaurant) return showNotification('Restaurant not found!');
    const item = restaurant.menuItems.find(i => i.id === itemId);
    if (!item) return showNotification('Item not found!');
    handleOrderNow(item, restaurant);
}

function openProfileTab(tabName) {
  profileModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  profileTabBtns.forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
  });
  profileTabContents.forEach(tab => {
    tab.classList.toggle('active', tab.classList.contains(`${tabName}-tab`));
  });
  if (tabName === 'orders') displayOrderHistory();
  if (tabName === 'addresses') displayAddresses();
  if (tabName === 'info') updateProfileDisplay();
}

openProfileTab('orders'); // or 'addresses', 'settings', 'info'

function initializeFeedbackStars() {
    document.querySelectorAll('.feedback-stars i').forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            document.querySelectorAll('.feedback-stars i').forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= rating) {
                    s.className = 'fas fa-star active';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });
}

// --- FEATURE: Order Tracking, Loyalty Points, Favorites UI ---

// Render order timeline/status in Orders tab
function renderOrderTimeline() {
    if (!currentUser || !currentUser.orders) return;
    const orderHistory = document.getElementById('orderHistory');
    if (!orderHistory) return;
    orderHistory.innerHTML = '';
    currentUser.orders.forEach(order => {
        const statusSteps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
        const currentStep = statusSteps.indexOf(order.status);
        orderHistory.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">${new Date(order.createdAt || order.date).toLocaleString()}</span>
                    <span class="order-status status-${order.status.replace(/\s/g, '_').toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-timeline-bar">
                    ${statusSteps.map((step, idx) => `
                        <span class="timeline-step${idx <= currentStep ? ' active' : ''}">${step}</span>
                    `).join('')}
                </div>
                <div class="order-items">
                    ${order.items.map(item => `<div>${item.name} x${item.quantity || 1}</div>`).join('')}
                </div>
                <div class="order-total">Total: ₹${order.total || 0}</div>
            </div>
        `;
    });
}

// Simulate order status changes and update UI
function startOrderTracking(order) {
    simulateOrderTracking(order, updatedOrder => {
        renderOrderTimeline();
    });
}

// Loyalty Points UI
function updateLoyaltyPointsDisplay() {
    const el = document.getElementById('loyaltyPointsDisplay');
    if (el && currentUser) {
        el.textContent = `Loyalty Points: ${currentUser.loyaltyPoints || 0}`;
    }
}

// Favorites UI
function renderFavoritesTab() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList || !currentUser) return;
    let html = '';
    // Favorite Items
    if (currentUser.favoriteItems && currentUser.favoriteItems.length > 0) {
        html += '<h4>Favorite Items</h4>';
        html += '<ul>' + currentUser.favoriteItems.map(itemId => {
            const item = findMenuItemById(itemId);
            return item ? `<li>${item.name}</li>` : '';
        }).join('') + '</ul>';
    }
    // Favorite Restaurants
    if (currentUser.favoriteRestaurants && currentUser.favoriteRestaurants.length > 0) {
        html += '<h4>Favorite Restaurants</h4>';
        html += '<ul>' + currentUser.favoriteRestaurants.map(restId => {
            const rest = findRestaurantById(restId);
            return rest ? `<li>${rest.name}</li>` : '';
        }).join('') + '</ul>';
    }
    if (!html) html = '<p class="no-data">No favorites yet.</p>';
    favoritesList.innerHTML = html;
}

// Add heart icons to menu items and restaurant cards (call in display functions)
function renderFavoriteIcons() {
    // For menu items
    document.querySelectorAll('.menu-item').forEach(el => {
        const itemId = el.dataset.itemId;
        if (!itemId) return;
        let favIcon = el.querySelector('.menu-item-favorite');
        if (!favIcon) {
            favIcon = document.createElement('span');
            favIcon.className = 'menu-item-favorite';
            favIcon.innerHTML = '<i class="fa fa-heart"></i>';
            favIcon.onclick = e => {
                e.stopPropagation();
                toggleFavoriteItem(Number(itemId));
                renderFavoriteIcons();
                renderFavoritesTab();
            };
            el.appendChild(favIcon);
        }
        if (currentUser && currentUser.favoriteItems.includes(Number(itemId))) {
            favIcon.querySelector('i').classList.add('active');
        } else {
            favIcon.querySelector('i').classList.remove('active');
        }
    });
    // For restaurant cards
    document.querySelectorAll('.restaurant-card').forEach(el => {
        const restId = el.dataset.restaurantId;
        if (!restId) return;
        let favIcon = el.querySelector('.restaurant-favorite');
        if (!favIcon) {
            favIcon = document.createElement('span');
            favIcon.className = 'restaurant-favorite';
            favIcon.innerHTML = '<i class="fa fa-heart"></i>';
            favIcon.onclick = e => {
                e.stopPropagation();
                toggleFavoriteRestaurant(Number(restId));
                renderFavoriteIcons();
                renderFavoritesTab();
            };
            el.appendChild(favIcon);
        }
        if (currentUser && currentUser.favoriteRestaurants.includes(Number(restId))) {
            favIcon.querySelector('i').classList.add('active');
        } else {
            favIcon.querySelector('i').classList.remove('active');
        }
    });
}

// Helper to find menu item by id
function findMenuItemById(id) {
    for (const rest of restaurants) {
        const item = rest.menu.find(i => i.id === id);
        if (item) return item;
    }
    return null;
}
// Helper to find restaurant by id
function findRestaurantById(id) {
    return restaurants.find(r => r.id === id) || null;
}

// Call these functions in appropriate places:
// - After login/registration: updateLoyaltyPointsDisplay(), renderFavoritesTab(), renderOrderTimeline()
// - After placing order: updateLoyaltyPointsDisplay(), renderOrderTimeline(), startOrderTracking(order)
// - After toggling favorites: renderFavoritesTab(), renderFavoriteIcons()
// - After displaying menu/restaurants: renderFavoriteIcons()

// --- Payment Gateway ---
function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('active');
}
function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('active');
  document.getElementById('paymentStatus').textContent = '';
}
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.onsubmit = function(e) {
        e.preventDefault();
        document.getElementById('paymentStatus').textContent = 'Processing...';
        setTimeout(() => {
            document.getElementById('paymentStatus').textContent = 'Payment Successful!';
            setTimeout(() => {
                closePaymentModal();
                // Place the order after payment
                const order = {
                    items: cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        image: item.image
                    })),
                    total: cart.reduce((sum, item) => sum + item.price, 0)
                };
                addOrderToHistory(order);
                clearCart();
                showNotification('Order placed successfully!');
            }, 1200);
        }, 1500);
    };
}

// --- Real-time Chat Support ---
function toggleChatWidget() {
    const chat = document.getElementById('chatWidget');
    chat.classList.toggle('active');
    if (chat.classList.contains('active')) {
        document.getElementById('openChatBtn').style.display = 'none';
        // If chat is empty, show initial message with quick replies
        const chatBody = document.getElementById('chatBody');
        if (chatBody.children.length === 0) {
            setTimeout(() => {
                const welcomeMsg = "Hello! How can I help you today?";
                appendChatMessage('Support', welcomeMsg);
                showQuickReplies(['My Order', 'Payment Issues', 'Contact Us']);
            }, 500);
        }
    } else {
        document.getElementById('openChatBtn').style.display = 'block';
    }
}

document.getElementById('chatForm').onsubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendChatMessage('You', msg);
    input.value = '';
    clearQuickReplies();
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        const reply = getChatBotReply(msg);
        appendChatMessage('Support', reply.text);
        if (reply.quickReplies) {
            showQuickReplies(reply.quickReplies);
        }
    }, 1200);
};

function loadChatHistory() {
    const chatBody = document.getElementById('chatBody');
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (chatBody) {
        chatBody.innerHTML = '';
        history.forEach(msg => appendChatMessage(msg.sender, msg.text, msg.timestamp, false));
    }
}

function appendChatMessage(sender, text, timestamp, save = true) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const messageTimestamp = timestamp ? new Date(timestamp) : new Date();

    const div = document.createElement('div');
    div.classList.add('chat-message', sender === 'You' ? 'user-message' : 'support-message');

    div.innerHTML = `
    <div class="message-content">
        <span class="message-sender">${sender}</span>
        <p class="message-text">${text}</p>
    </div>
    <span class="message-timestamp">${messageTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (save) {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        // Limit history to last 50 messages
        if (history.length > 50) {
            history.shift();
        }
        history.push({ sender, text, timestamp: messageTimestamp.toISOString() });
        localStorage.setItem('chatHistory', JSON.stringify(history));
    }
}

function getChatBotReply(msg) {
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('order')) {
        return { text: 'You can track your order in the Orders tab in your profile!', quickReplies: ['View Profile', 'Contact Support'] };
    }
    if (lowerMsg.includes('payment')) {
        return { text: 'We accept all major cards, and our payment process is secure. What specific issue are you facing?', quickReplies: ['Payment Failed', 'Refund Status'] };
    }
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return { text: 'Hello there! What can I assist you with?', quickReplies: ['My Order', 'Payment Issues', 'Contact Us'] };
    }
    if (lowerMsg.includes('contact')) {
        return { text: 'You can reach our team at support@deliciousbites.com.' };
    }
    return { text: "I'm sorry, I didn't quite understand. A support agent will get back to you soon. In the meantime, maybe I can help with one of these topics?", quickReplies: ['My Order', 'Payment Issues', 'Contact Us'] };
}

function showTypingIndicator() {
    const chatBody = document.getElementById('chatBody');
    if (document.getElementById('typingIndicator')) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.classList.add('chat-message', 'support-message');
    typingDiv.innerHTML = `
        <div class="message-content">
            <span class="message-sender">Support</span>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function showQuickReplies(replies) {
    const quickRepliesContainer = document.getElementById('quickReplies');
    clearQuickReplies();

    replies.forEach(replyText => {
        const button = document.createElement('button');
        button.textContent = replyText;
        button.onclick = () => {
            document.getElementById('chatInput').value = replyText;
            document.getElementById('chatForm').dispatchEvent(new Event('submit'));
        };
        quickRepliesContainer.appendChild(button);
    });
}

function clearQuickReplies() {
    const quickRepliesContainer = document.getElementById('quickReplies');
    if (quickRepliesContainer) {
        quickRepliesContainer.innerHTML = '';
    }
}

// --- Dietary Preferences & Allergen Info ---
function saveDietaryPreferences() {
  const prefs = {
    veg: document.getElementById('prefVeg').checked,
    vegan: document.getElementById('prefVegan').checked,
    gluten: document.getElementById('prefGluten').checked,
    nut: document.getElementById('prefNut').checked,
    dairy: document.getElementById('prefDairy').checked
  };
  localStorage.setItem('dietaryPrefs', JSON.stringify(prefs));
}
function loadDietaryPreferences() {
  const prefs = JSON.parse(localStorage.getItem('dietaryPrefs') || '{}');
  document.getElementById('prefVeg').checked = !!prefs.veg;
  document.getElementById('prefVegan').checked = !!prefs.vegan;
  document.getElementById('prefGluten').checked = !!prefs.gluten;
  document.getElementById('prefNut').checked = !!prefs.nut;
  document.getElementById('prefDairy').checked = !!prefs.dairy;
}
['prefVeg','prefVegan','prefGluten','prefNut','prefDairy'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.onchange = saveDietaryPreferences;
});
loadDietaryPreferences();

function showDietaryInfoForProduct(item) {
  const infoDiv = document.getElementById('dietaryInfo');
  if (!infoDiv) return;
  let info = [];
  if (item.veg) info.push('Vegetarian');
  if (item.vegan) info.push('Vegan');
  if (item.glutenFree) info.push('Gluten-Free');
  if (item.nutFree) info.push('Nut-Free');
  if (item.dairyFree) info.push('Dairy-Free');
  infoDiv.textContent = info.length ? 'Dietary: ' + info.join(', ') : '';
}

// Profile (example: fetch and display)
async function loadProfile(email) {
    const res = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
    if (res.ok) {
        const user = await res.json();
        document.getElementById('userName').textContent = user.username;
        document.getElementById('userEmail').textContent = user.email;
        // ... update other profile fields ...
    }
}

// Password Reset (add a form in your HTML and this handler)
document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.email.value;
    const newPassword = this.newPassword.value;
    const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    });
    const data = await res.json();
    alert(data.message);
});


document.addEventListener('DOMContentLoaded', function() {
    // --- LOGIN NOW BUTTON ---
    const loginRequiredBtn = document.getElementById('loginRequiredBtn');
    const loginModal = document.getElementById('loginModal');
    if (loginRequiredBtn && loginModal) {
        loginRequiredBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // --- SIGNUP FORM ---
    


    // --- LOGIN FORM ---
    const emailLoginForm = document.getElementById('emailLoginForm');
    if (emailLoginForm) {
        emailLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailLoginForm.querySelector('input[type="email"]').value.trim();
            const password = emailLoginForm.querySelector('input[type="password"]').value.trim();

            if (!email || !password) {
                showNotification('Please enter both email and password');
                return;
            }

            // Get user from localStorage
            const user = JSON.parse(localStorage.getItem('userData') || '{}');
            if (user && user.email === email && user.password === password) {
                currentUser = user;
                isLoggedIn = true;
                updateLoginState();
                checkLoginStatusAndUpdateUI();
                showNotification('Login successful!');
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                displayRestaurants();
                initializeFeatures();
                emailLoginForm.reset();
            } else {
                showNotification('Invalid email or password');
                emailLoginForm.querySelector('input[type="password"]').value = '';
            }
        });
    }

    // --- SIGNUP/LOGIN LINK SWITCHING ---
    document.querySelectorAll('.signup-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('emailLoginForm').classList.remove('active');
            document.getElementById('phoneLoginForm').classList.remove('active');
            document.getElementById('signupForm').classList.add('active');
        });
    });
    document.querySelectorAll('.login-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('signupForm').classList.remove('active');
            document.getElementById('emailLoginForm').classList.add('active');
        });
    });
});

// ... existing code ...

// Signup Form Handler (fetch to backend)

// Login Form Handler (fetch to backend)


// --- USER AUTHENTICATION (CLEANED, BACKEND ONLY) ---

document.addEventListener('DOMContentLoaded', function() {
    // --- LOGIN FORM ---
    const emailLoginForm = document.getElementById('emailLoginForm');
    const loginModal = document.getElementById('loginModal');
    if (emailLoginForm) {
        emailLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = emailLoginForm.querySelector('input[type="email"]').value.trim();
            const password = emailLoginForm.querySelector('input[type="password"]').value.trim();

            if (!email || !password) {
                showNotification('Please enter both email and password');
                return;
            }

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    // Save user info if needed
                    localStorage.setItem('authToken', data.token || '');
                    currentUser = { name: data.name, email: data.email };
                    isLoggedIn = true;
                    updateLoginState();
                    checkLoginStatusAndUpdateUI();
                    showNotification('Login successful!');
                    if (loginModal) {
                        loginModal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    displayRestaurants();
                    initializeFeatures();
                    emailLoginForm.reset();
                } else {
                    showNotification(data.error || 'Invalid email or password');
                    emailLoginForm.querySelector('input[type="password"]').value = '';
                }
            } catch (error) {
                showNotification('Login failed. Please try again.');
                emailLoginForm.querySelector('input[type="password"]').value = '';
            }
        });
    }

    // --- SIGNUP FORM ---
   
    // --- SIGNUP/LOGIN LINK SWITCHING (unchanged) ---
    document.querySelectorAll('.signup-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('emailLoginForm').classList.remove('active');
            document.getElementById('phoneLoginForm').classList.remove('active');
            document.getElementById('signupForm').classList.add('active');
        });
    });

    // --- PHONE LOGIN (OPTIONAL, COMMENT OUT IF NOT USED) ---
    // const phoneLoginForm = document.getElementById('phoneLoginForm');
    // if (phoneLoginForm) {
    //     phoneLoginForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         // ... phone login logic ...
    //     });
    // }
});


// --- ENSURE SIGNUP/LOGIN LINK SWITCHING ALWAYS WORKS ---

// This must be at the end of the file to guarantee DOM is loaded
setTimeout(() => {
  try {
    document.querySelectorAll('.signup-link').forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('Sign up link clicked!');
        e.preventDefault();
        const emailForm = document.getElementById('emailLoginForm');
        const phoneForm = document.getElementById('phoneLoginForm');
        const signupForm = document.getElementById('signupForm');
        if (emailForm) emailForm.classList.remove('active');
        if (phoneForm) phoneForm.classList.remove('active');
        if (signupForm) signupForm.classList.add('active');
      });
    });
    document.querySelectorAll('.login-link').forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('Login link clicked!');
        e.preventDefault();
        const signupForm = document.getElementById('signupForm');
        const emailForm = document.getElementById('emailLoginForm');
        if (signupForm) signupForm.classList.remove('active');
        if (emailForm) emailForm.classList.add('active');
      });
    });
    console.log('Signup/login link switching handlers attached.');
  } catch (err) {
    console.error('Error attaching signup/login link switching:', err);
  }
}, 0);

// ... existing code ...

// --- FINAL BULLETPROOF SIGNUP/LOGIN LINK SWITCHING ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.signup-link').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      var emailForm = document.getElementById('emailLoginForm');
      var phoneForm = document.getElementById('phoneLoginForm');
      var signupForm = document.getElementById('signupForm');
      if (emailForm) emailForm.classList.remove('active');
      if (phoneForm) phoneForm.classList.remove('active');
      if (signupForm) signupForm.classList.add('active');
      console.log('Signup link clicked, form switched!');
    }
  });
  document.querySelectorAll('.login-link').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      var signupForm = document.getElementById('signupForm');
      var emailForm = document.getElementById('emailLoginForm');
      if (signupForm) signupForm.classList.remove('active');
      if (emailForm) emailForm.classList.add('active');
      console.log('Login link clicked, form switched!');
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Always start with only the email login form visible
  document.getElementById('emailLoginForm').classList.add('active');
  document.getElementById('signupForm').classList.remove('active');
  document.getElementById('phoneLoginForm').classList.remove('active');

  // Show signup form when "Sign up" is clicked
  document.querySelectorAll('.signup-link').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      document.getElementById('emailLoginForm').classList.remove('active');
      document.getElementById('phoneLoginForm').classList.remove('active');
      document.getElementById('signupForm').classList.add('active');
      console.log('Signup link clicked, form switched!');
    }
  });

  // Show login form when "Login" is clicked
  document.querySelectorAll('.login-link').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      document.getElementById('signupForm').classList.remove('active');
      document.getElementById('emailLoginForm').classList.add('active');
      document.getElementById('phoneLoginForm').classList.remove('active');
      console.log('Login link clicked, form switched!');
    }
  });
});

document.getElementById('addressForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const address = {
        address_line1: document.getElementById('addressLine1').value,
        address_line2: document.getElementById('addressLine2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        label: document.getElementById('label').value
    };
    // Add authentication header if needed
    const res = await fetch('http://localhost:3000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
    });
    const data = await res.json();
    if (res.ok && data.success) {
        showNotification('Address saved!');
        // Optionally refresh address list
    } else {
        showNotification('Failed to save address');
    }
});

document.getElementById('addAddressBtn').addEventListener('click', function() {
    document.getElementById('addressModal').classList.add('active');
    document.body.style.overflow = 'hidden';
});

document.addEventListener('DOMContentLoaded', function() {
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addressModal = document.getElementById('addressModal');
    if (addAddressBtn && addressModal) {
        addAddressBtn.addEventListener('click', function() {
            addressModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    // Also add close handler for the modal
    const closeAddressModal = document.getElementById('closeAddressModal');
    if (closeAddressModal && addressModal) {
        closeAddressModal.addEventListener('click', function() {
            addressModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});
