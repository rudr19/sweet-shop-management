# Sweet Shop Management System

A full-stack web application for managing a sweet shop with a complete e-commerce experience. Features user authentication, inventory management, shopping cart, and checkout flow. Customers can browse sweets, add to cart, and complete purchases, while admins manage inventory through a comprehensive dashboard.

## Quick Start

```bash
# 1. Setup database
psql -U postgres -c "CREATE DATABASE sweet_shop;"

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env with your database credentials

# 3. Install dependencies and initialize
npm install
npm run db:init
npm run seed:all

# 4. Start backend server
npm run dev

# 5. In a new terminal, setup and start frontend
cd frontend
npm install
npm run dev

# 6. Open http://localhost:5173 and login with:
#    Admin: admin@sweetshop.com / admin123
#    Customer: customer@sweetshop.com / customer123
```

## Technology Stack

### Backend
- Node.js with TypeScript
- Express.js
- PostgreSQL
- JWT Authentication
- Jest for testing

### Frontend
- React with TypeScript
- React Router
- Axios for API calls
- React Testing Library

## Project Structure

```
sweet-shop/
├── backend/          # Express API server
├── frontend/         # React application
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

### Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from https://www.postgresql.org/download/
   - Follow installation instructions for your operating system

2. **Create the database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create the database
   CREATE DATABASE sweet_shop;

   # Exit psql
   \q
   ```

3. **Configure database connection**
   - Copy `.env.example` to `.env` in the backend directory
   - Update with your credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sweet_shop
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=any_random_secret_string_here
   PORT=3000
   ```

   **Where to get these:**
   - `DB_USER` and `DB_PASSWORD`: Your PostgreSQL login credentials
   - `JWT_SECRET`: Create any random string (e.g., "my_secret_key_123")
   - Other values: Keep as shown above

4. **Initialize the database schema**
   ```bash
   cd backend
   npm run db:init
   ```

5. **Seed the database with sample data** (Optional but recommended)

   After initializing the database, you can populate it with sample data:

   ```bash
   # Seed both users and sweets
   npm run seed:all

   # Or seed individually:
   npm run seed:users    # Creates admin and customer accounts
   npm run seed:sweets   # Creates 50 sample sweets with descriptions
   ```

   This will create:
   - **3 test accounts** (admin, customer, and test user)
   - **50 sweets** with realistic names, categories, prices, and descriptions

   The seed script output will show you the login credentials!

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The API server will start on http://localhost:3000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The React app will start on http://localhost:5173

### Running the Full Application

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Open your browser to http://localhost:5173
   - Use the pre-seeded test accounts below

## Login Credentials

After running the seed script (`npm run seed:users`), you'll have these demo accounts:

**Admin Account:**
- Email: `admin@sweetshop.com`
- Password: `admin123`
- Features: Dashboard with stats, add/edit/delete sweets, manage inventory, restock items

**Customer Account:**
- Email: `customer@sweetshop.com`
- Password: `customer123`
- Features: Browse sweets, search/filter by category, add to cart, checkout flow

**Test User:**
- Email: `john@example.com`
- Password: `password123`
- Features: Same as customer account

To test it out:
1. Run `npm run seed:all` in the backend directory (if you haven't already)
2. Start both backend and frontend servers
3. Go to http://localhost:5173/login
4. Use any account above
5. Admins see a dashboard with inventory management, customers see an e-commerce shopping interface

**Customer Features:**
- 🛒 **Add to Cart** - Add items and continue shopping
- ⚡ **Buy Now** - Quick checkout for single items
- 🛍️ **Checkout** - Complete checkout flow with shipping info and order confirmation
- 🔍 **Search & Filter** - Search by name/category, filter by category, sort by price/stock

**Creating New Accounts:**
You can register new accounts at `/register` and choose the account type:
- Select "Customer" to browse and purchase sweets (e-commerce view)
- Select "Admin" to manage inventory (dashboard view)
This makes it easy to demo both interfaces!

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

#### Sweets (Protected - Requires Auth Token)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets by name, category, or price range
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

#### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

#### User Profile (Protected)
- `GET /api/profile` - Get user profile information
- `PUT /api/profile` - Update user profile (name, phone, address, etc.)
- `POST /api/profile/change-password` - Change user password

#### Orders (Protected)
- `GET /api/orders` - Get all orders for the authenticated user
- `GET /api/orders/:id` - Get specific order with items
- `POST /api/orders` - Create a new order (checkout)

#### Payment Methods (Protected)
- `GET /api/payment-methods` - Get all saved payment methods
- `POST /api/payment-methods` - Add a new payment method
- `PUT /api/payment-methods/:id/default` - Set payment method as default
- `DELETE /api/payment-methods/:id` - Delete a payment method

## My AI Usage

I used AI tools during this project, and here's how they helped me build this application.

### What I Used
I worked with a couple of AI assistants:
- **Claude Sonnet 4.5** (Anthropic) - For code generation and architecture
- **GitHub Copilot** - For inline code suggestions and autocomplete
- **ChatGPT** - For debugging and problem-solving

### How I Worked With AI

**Getting Started:**
When I first read the requirements, I wasn't sure where to begin. I used Claude and ChatGPT to help me break down the project into smaller tasks and decide on the tech stack. We went with Node.js/TypeScript for the backend and React for the frontend since I'm comfortable with JavaScript.

**Writing Tests First:**
This was my first time properly doing TDD, so AI really helped here. For each feature, I'd ask it to help me write the test cases first. Then I'd implement the actual code to make the tests pass. Sometimes the tests would fail because I misunderstood something, and I'd have to debug and fix it. The tests for authentication and CRUD operations were mostly AI-generated, but I reviewed each one to make sure they actually tested what they should.

**Backend Development:**
The backend structure (routes, controllers, models) was generated with AI help. I gave it the requirements, and it created the basic Express setup. I had to manually configure the database connection and environment variables. The JWT authentication middleware and password hashing was AI-generated, but I read through it to understand how tokens work.

**Frontend Work:**
For the React components, I started with AI-generated boilerplate and then customized the styling to make it look nice. The login and register forms were mostly AI code, but I tweaked the colors and layout to match what I wanted. The dashboard layout took some back-and-forth - I kept asking for changes until it looked right.

**What I Did Myself vs. AI:**
- Project setup and configuration: Mostly me (installing Node, PostgreSQL, setting up .env)
- Database design: Asked Claude for the schema structure, I reviewed and modified it
- API endpoints: AI generated the initial code, I tested everything with Postman
- React components: Claude created initial versions, I customized styling and layout
- Debugging: Used ChatGPT when I got stuck on errors, fixed simpler issues myself
- Git commits: I wrote the commit messages myself

**Challenges I Faced:**
- TypeScript errors everywhere initially - had to learn about interfaces and types
- CORS problems when connecting frontend to backend - AI helped me configure it
- Understanding how JWT tokens work in the auth middleware
- Figuring out how to properly structure the REST API endpoints

**What I Learned:**
Working with AI taught me a lot about:
- How to structure a full-stack application properly
- Test-driven development (writing tests before code)
- RESTful API design patterns
- React hooks and state management
- How authentication works with JWT tokens

The biggest benefit was speed - what might've taken me weeks of googling and trial-and-error took a couple of days. But I still had to understand everything, debug issues, and make decisions about what I wanted.

**My Thoughts:**
Using AI tools like Claude and ChatGPT is super helpful for getting past the initial "blank page" problem and generating boilerplate code. But you still need to understand what it's doing, test everything, and customize it to your needs. I wouldn't rely on it blindly - I always read the code it generates and make sure I understand it before using it.

Would I use it again? Definitely. It's like having knowledgeable coding buddies who can quickly write basic code while you focus on the logic and design. Claude was better for generating complete code structures, while ChatGPT was helpful for explaining concepts and debugging specific errors.

## Testing & Test Report

### Test Coverage
All 21 tests passing with 100% success rate.

**Test Results:**
```
Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
Time:        8.087s

Authentication API (9 tests)
✅ should register a new user successfully
✅ should not register a user with duplicate email
✅ should require email and password
✅ should validate email format
✅ should require minimum password length
✅ should login successfully with correct credentials
✅ should not login with incorrect password
✅ should not login with non-existent email
✅ should require email and password

Sweets API (12 tests)
✅ should create a new sweet with valid authentication
✅ should not create sweet without authentication
✅ should validate required fields
✅ should validate price is non-negative
✅ should get all sweets with authentication
✅ should not get sweets without authentication
✅ should update sweet with valid authentication
✅ should not update sweet without authentication
✅ should return 404 for non-existent sweet
✅ should delete sweet with admin authentication
✅ should not delete sweet with regular user authentication
✅ should not delete sweet without authentication
```

### Running Tests
```bash
cd backend
npm test
```

### Test Coverage Includes
- User registration and login flows
- Email validation and duplicate prevention
- JWT token authentication and authorization
- CRUD operations for sweets management
- Admin-only operations (delete, restock)
- Inventory management (purchase decreases quantity)
- Input validation and error handling

## Deployment

### Deploy on Render (Free)

Deploy the entire application on [Render.com](https://render.com):

**Steps:**

1. **Create PostgreSQL Database**
   - New + → PostgreSQL
   - Note the Internal Database URL

2. **Deploy Backend (Web Service)**
   - New + → Web Service
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `DATABASE_URL` (from step 1)
     - `JWT_SECRET=your_secret_key`
     - `PORT=3000`

3. **Deploy Frontend (Static Site)**
   - New + → Static Site
   - Connect same GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variable:
     - `VITE_API_URL=your_backend_url` (from step 2)

4. **Initialize Database**
   - In backend web service shell, run:
   - `npm run db:init`
   - `npm run seed:all`

Your application will be live on Render's free tier.

## Screenshots

(Screenshots of the application will be added here)

## Copyright

© 2025 Rudra Kumar Pandey ([@rudr19](https://github.com/rudr19))

## License

MIT
