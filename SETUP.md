# Database Setup Guide

## Prerequisites
1. **PostgreSQL** must be installed and running on your system
2. **Node.js** and **npm** must be installed

## Step 1: Install PostgreSQL (if not already installed)

### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. **Important**: Remember the password you set for the `postgres` user
4. Make sure PostgreSQL service is running

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Create Database

1. Open PostgreSQL command prompt or pgAdmin
2. Create the database:
```sql
CREATE DATABASE ecommerce_db;
```

## Step 3: Update Database Password

1. Open `server.js` file
2. Find this line:
```javascript
password: process.env.DB_PASSWORD || 'your_actual_postgres_password',
```
3. Replace `'your_actual_postgres_password'` with your actual PostgreSQL password

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Server

```bash
npm start
```

## Step 6: Test the Setup

1. Open your browser and go to: `http://localhost:3000`
2. Try to register a new user
3. Check the server console for any error messages

## Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Make sure PostgreSQL is running
   - Check if the password in `server.js` is correct
   - Verify the database `ecommerce_db` exists

2. **"User with this email already exists"**
   - This is normal if you've already registered with that email
   - Try with a different email address

3. **"Invalid email or password" after registration**
   - Check the server console for detailed error messages
   - Make sure the database tables were created successfully

### Check Database Tables:

Connect to your database and run:
```sql
\dt
```
You should see tables: `users`, `reviews`, `products`

### Check Users Table:

```sql
SELECT * FROM users;
```

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
```
DB_PASSWORD=your_actual_postgres_password
JWT_SECRET=your-secret-key-change-this-in-production
```

2. Install dotenv:
```bash
npm install dotenv
```

3. Add to the top of `server.js`:
```javascript
require('dotenv').config();
```

## Test User Creation

After setup, you can test by:
1. Registering a new user through the website
2. Checking the database: `SELECT * FROM users;`
3. Trying to login with the same credentials 