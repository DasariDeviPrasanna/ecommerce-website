const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use(bodyParser.json());

// Database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce_db',
    password: 'Devi1413',
    port: 5432,
});

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Database initialization
async function initializeDatabase() {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password_hash VARCHAR(255) NOT NULL,
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create reviews table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                product_id INTEGER NOT NULL,
                user_name VARCHAR(100),
                rating INTEGER NOT NULL,
                review_text TEXT,
                review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create products table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(100),
                restaurant_id INTEGER,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database tables created successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Initialize database on startup
initializeDatabase();

// Function to reset database tables (use this if you have column mismatch issues)
async function resetDatabase() {
    try {
        console.log('🔄 Resetting database tables...');
        
        // Drop existing tables in correct order (due to foreign key constraints)
        await pool.query('DROP TABLE IF EXISTS reviews CASCADE');
        await pool.query('DROP TABLE IF EXISTS products CASCADE');
        await pool.query('DROP TABLE IF EXISTS users CASCADE');
        
        console.log('✅ Tables dropped successfully');
        
        // Recreate tables
        await initializeDatabase();
        
        console.log('✅ Database reset completed successfully');
    } catch (error) {
        console.error('❌ Database reset error:', error);
    }
}

// Uncomment the line below to reset the database (only use when needed)
// resetDatabase();

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        console.log('📝 Registration attempt:', { name, email, phone: phone ? 'provided' : 'not provided' });

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        console.log('🔐 Password hashed successfully');

        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
            [name, email, phone, passwordHash]
        );

        console.log('✅ User created successfully:', newUser.rows[0].id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id, email: newUser.rows[0].email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0],
            token
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'User with this email already exists' });
        } else if (error.code === 'ECONNREFUSED') {
            res.status(500).json({ error: 'Database connection failed. Please check your PostgreSQL setup.' });
        } else {
            res.status(500).json({ error: 'Internal server error: ' + error.message });
        }
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Login attempt for email:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('✅ User found:', user.rows[0].id);

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isValidPassword) {
            console.log('❌ Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('✅ Password verified for user:', email);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.rows[0].id, email: user.rows[0].email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password_hash, ...userWithoutPassword } = user.rows[0];

        console.log('✅ Login successful for user:', email);

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        if (error.code === 'ECONNREFUSED') {
            res.status(500).json({ error: 'Database connection failed. Please check your PostgreSQL setup.' });
        } else {
            res.status(500).json({ error: 'Internal server error: ' + error.message });
        }
    }
});

// Verify Token Endpoint
app.get('/api/verify-token', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user data
        const user = await pool.query(
            'SELECT id, name, email, phone, avatar_url, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Token is valid',
            user: user.rows[0]
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Submit Review
app.post('/api/reviews', async (req, res) => {
    const { productId, user, rating, text } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reviews (product_id, user_name, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
            [productId, user, rating, text]
        );
        res.status(201).json({ success: true, review: result.rows[0] });
    } catch (err) {
        console.error('Error saving review:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Get Reviews for a Product
app.get('/api/reviews/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await pool.query(`
            SELECT r.*, u.name as username 
            FROM reviews r 
            JOIN users u ON r.user_name = u.name 
            WHERE r.product_id = $1 
            ORDER BY r.review_date DESC
        `, [productId]);

        res.json(reviews.rows);

    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await pool.query(
            'SELECT id, name, email, phone, avatar_url, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.rows[0]);

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, avatar_url } = req.body;

        const updatedUser = await pool.query(
            'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), avatar_url = COALESCE($3, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, phone, avatar_url',
            [name, phone, avatar_url, userId]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Reviews
app.get('/api/user/reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const reviews = await pool.query(`
            SELECT r.*, p.name as product_name 
            FROM reviews r 
            JOIN products p ON r.product_id = p.id 
            WHERE r.user_name = $1 
            ORDER BY r.review_date DESC
        `, [userId]);

        res.json(reviews.rows);

    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: PostgreSQL`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 