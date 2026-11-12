# Expense Tracker 2.0 - Local Development Setup

This guide walks you through setting up the Expense Tracker application for local development.

## Prerequisites

- **Node.js:** v20 or higher (download from https://nodejs.org/)
- **npm:** v10 or higher (comes with Node.js)
- **MongoDB:** Atlas account (cloud) or local MongoDB instance
  - Free tier: https://www.mongodb.com/cloud/atlas

## Project Structure

```
expense-tracker/
├── back-end/          # Express.js server
│   ├── index.js       # Entry point
│   ├── routes/        # API route handlers
│   ├── models/        # Mongoose schemas
│   ├── package.json
│   ├── .env           # Environment variables (DO NOT COMMIT)
│   └── .env.example   # Example environment file
├── frontEnd/          # React application
│   ├── src/
│   ├── package.json
│   ├── .env           # Environment variables (DO NOT COMMIT)
│   └── .env.example   # Example environment file
└── README.md
```

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Irirwanirira/expense-tracker.git
cd expense-tracker

# Install backend dependencies
cd back-end
npm install

# Install frontend dependencies
cd ../frontEnd
npm install
cd ..
```

## Step 2: Configure Backend Environment

```bash
# Copy the example environment file
cp back-end/.env.example back-end/.env

# Edit .env with your MongoDB connection string
# Example:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
# PORT=5000
```

**Getting a MongoDB Connection String:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new database cluster
4. Create a user with read/write permissions
5. Get the connection string (replace `<username>` and `<password>`)

## Step 3: Configure Frontend Environment

```bash
# Copy the example environment file
cp frontEnd/.env.example frontEnd/.env

# Edit .env (default is already correct for local development):
# REACT_APP_API_BASE_URL=http://localhost:5000
```

## Step 4: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd back-end
npm run server
# Expected output: ✓ Server running on http://localhost:5000
#                 ✓ Database connected
```

**Terminal 2 - Frontend Application:**
```bash
cd frontEnd
npm start
# Browser will open to http://localhost:3000
```

## Step 5: Verify Everything Works

1. **Frontend** should open at http://localhost:3000
2. **Backend** should be running at http://localhost:5000
3. Test the API by visiting: http://localhost:5000/health
   - You should see: `{"status":"OK","message":"Server is running"}`

## Available API Endpoints (Phase 1)

### Transactions
- `POST /v1/api/transactions` — Create a transaction
- `GET /v1/api/transactions` — Fetch all transactions
- `DELETE /v1/api/transactions/:id` — Delete a transaction

### Categories
- `POST /v1/api/categories` — Create a category
- `GET /v1/api/categories` — Fetch all categories
- `DELETE /v1/api/categories/:id` — Delete a category

### Health
- `GET /health` — Check server status

## Common Issues

**Issue:** Backend fails to start with "DB_URL is not set"
- **Solution:** Create `back-end/.env` with a valid MongoDB connection string

**Issue:** Frontend can't connect to backend
- **Solution:** Make sure backend is running and `REACT_APP_API_BASE_URL` is set to `http://localhost:5000`

**Issue:** MongoDB connection error
- **Solution:** 
  - Check your internet connection
  - Verify the connection string is correct
  - Ensure your MongoDB Atlas IP whitelist includes your computer's IP

## Next Steps

After setup:
1. Explore the application
2. Create transactions and categories
3. Review the code in `back-end/routes/routes.js` and `frontEnd/src/features/`
4. For Phase 2, we'll add authentication and database improvements

## Environment Variables Reference

### Backend (.env)
- `DB_URL` — MongoDB connection string (required)
- `PORT` — Server port (default: 5000)

### Frontend (.env)
- `REACT_APP_API_BASE_URL` — Backend API URL (default: http://localhost:5000)

## Git Workflow

⚠️ **IMPORTANT:** Never commit `.env` files to git. They contain secrets.

```bash
# Before first commit:
git status  # Should show .env in "Untracked files"
# If .env is tracked, remove it:
git rm --cached back-end/.env frontEnd/.env
```

## Need Help?

- Check the [main README](./README.md)
- Review the [audit document](https://claude.ai/artifact/Sh2rMF8raUdXZbmRD7pxBz)
- Check backend logs in terminal where you ran `npm run server`
- Check browser console (F12) for frontend errors
