# Seed Data Documentation

This document explains how to populate your Sweet Shop database with sample data for testing and development.

## Available Seed Scripts

### 1. Seed Users (`npm run seed:users`)

Creates three test accounts with hashed passwords:

| Role     | Email                    | Password    | Access Level |
|----------|--------------------------|-------------|--------------|
| Admin    | admin@sweetshop.com      | admin123    | Full access to dashboard, inventory management, analytics |
| Customer | customer@sweetshop.com   | customer123 | Browse, search, cart, checkout |
| Test User| john@example.com         | password123 | Same as customer |

**What it does:**
- Clears existing users from the database
- Creates 3 user accounts with bcrypt-hashed passwords
- Displays login credentials after completion

**Run it:**
```bash
cd backend
npm run seed:users
```

### 2. Seed Sweets (`npm run seed:sweets`)

Creates 50 authentic Indian sweets with:
- Realistic names (Gulab Jamun, Rasgulla, Kaju Katli, etc.)
- Categories (Milk Based, Dry Fruit, Fried, Bengali, South Indian, etc.)
- Detailed descriptions
- Random prices ($1.00 - $10.00)
- Random quantities (10 - 110 units)

**What it does:**
- Clears existing sweets from the database
- Inserts 50 sweets with full details
- Displays progress for each sweet added

**Run it:**
```bash
cd backend
npm run seed:sweets
```

### 3. Seed All (`npm run seed:all`)

Runs both seed scripts in sequence:
1. Seeds users first
2. Then seeds sweets

**Run it:**
```bash
cd backend
npm run seed:all
```

## Sample Sweet Categories

The seed data includes sweets from these categories:
- **Milk Based** - Gulab Jamun, Rasgulla, Rasmalai, Kalakand, Rabri
- **Dry Fruit** - Kaju Katli, Pista Barfi, Kaju Roll, Anjeer Roll
- **Flour Based** - Ladoo, Besan Ladoo, Motichoor Ladoo, Moong Dal Halwa
- **Fried** - Jalebi, Gujiya, Balushahi, Malpua
- **Bengali** - Sandesh, Chum Chum, Kheer Kadam
- **South Indian** - Mysore Pak, Pootharekulu, Ariselu, Bobbatlu

## When to Use

### First Time Setup
```bash
npm run db:init    # Initialize database schema
npm run seed:all   # Populate with sample data
```

### Reset Data
```bash
npm run seed:all   # Clears and re-seeds everything
```

### Add Only Users
```bash
npm run seed:users # If you already have sweets
```

### Add Only Sweets
```bash
npm run seed:sweets # If you already have users
```

## Customizing Seed Data

### Adding More Users

Edit `backend/src/scripts/seedUsers.ts`:

```typescript
// Add new user
await pool.query(
  `INSERT INTO users (email, password, is_admin)
   VALUES ($1, $2, $3)
   ON CONFLICT (email) DO NOTHING`,
  ['newuser@example.com', await bcrypt.hash('password', 10), false]
);
```

### Adding More Sweets

Edit `backend/src/scripts/seedSweets.ts`:

```typescript
const sweets = [
  // Add new sweet object
  {
    name: 'Your Sweet',
    category: 'Category',
    description: 'Description here'
  },
  // ... rest of sweets
];
```

### Changing Price/Quantity Ranges

In `seedSweets.ts`, modify these lines:

```typescript
const price = (Math.random() * 9 + 1).toFixed(2); // $1-$10
const quantity = Math.floor(Math.random() * 100) + 10; // 10-110 units

// Example: Higher prices ($10-$50)
const price = (Math.random() * 40 + 10).toFixed(2);

// Example: Lower stock (5-25 units)
const quantity = Math.floor(Math.random() * 20) + 5;
```

## Database Schema

The seed scripts work with these tables:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sweets Table
```sql
CREATE TABLE sweets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### "Database does not exist"
Run `npm run db:init` first to create the schema.

### "Connection refused"
Ensure PostgreSQL is running and credentials in `.env` are correct.

### "Duplicate key error"
The script already clears existing data. If you see this, check for database triggers or constraints.

### "Permission denied"
Ensure your PostgreSQL user has INSERT and DELETE permissions on the database.

## Production Notes

⚠️ **Do NOT run seed scripts in production!**

These scripts:
- Delete all existing data with `DELETE FROM users/sweets`
- Create accounts with known passwords
- Are intended for development and testing only

For production:
- Use migrations instead of seed scripts
- Create admin accounts manually with strong passwords
- Import real product data from CSV or admin interface
