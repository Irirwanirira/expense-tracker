# Local Development Setup

## Prerequisites

### Option 1: With Docker (Recommended)
- Docker Desktop installed
- 4GB+ RAM available
- 2GB+ disk space

### Option 2: Without Docker
- Node.js 18+ installed
- MongoDB 4.0+ installed locally
- 2GB+ disk space

---

## Quick Start with Docker Compose

### 1. Start All Services
```bash
cd /Users/new/Documents/expense-tracker

# Start MongoDB, Backend, and Frontend
docker-compose up -d

# Wait 30 seconds for MongoDB to initialize
sleep 30

# Check status
docker-compose ps
```

Expected output:
```
NAME                           STATUS
expense-tracker-mongodb        Up (healthy)
expense-tracker-backend        Up
expense-tracker-frontend       Up
```

### 2. Access the Application

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:5000  
**API Documentation:** http://localhost:5000/api-docs  
**MongoDB:** localhost:27017

### 3. Stop Services
```bash
docker-compose down -v
# -v removes volumes (database data)
```

---

## Manual Local Setup (No Docker)

### 1. Install Dependencies

**Backend:**
```bash
cd back-end
npm install
```

**Frontend:**
```bash
cd front-end
npm install
```

### 2. Start MongoDB

**Option A: Using Homebrew (macOS)**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
# You should see: test>
# Exit with: exit
```

**Option B: Using Docker (Single Container)**
```bash
docker run -d \
  --name expense-tracker-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -p 27017:27017 \
  mongo:latest
```

**Option C: Using MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update DB_URL in .env files

### 3. Configure Backend

```bash
cd back-end

# Create .env.local file
cat > .env.local << 'EOF'
NODE_ENV=development
PORT=5000
DB_URL=mongodb://admin:password@localhost:27017/expense-tracker
JWT_SECRET=your-dev-secret-key-here
EOF
```

**For MongoDB Atlas**, use:
```
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

### 4. Build and Start Backend

```bash
cd back-end

# Build TypeScript
npm run build

# Start development server
npm start
```

You should see:
```
✓ Server running on http://localhost:5000
✓ Database connected
```

### 5. Configure and Start Frontend

```bash
cd front-end

# Create .env.local file
cat > .env.local << 'EOF'
REACT_APP_API_URL=http://localhost:5000
EOF

# Start development server
npm start
```

You should see:
```
Compiled successfully!

You can now view expense-tracker in the browser.

  Local:            http://localhost:3000
```

---

## Verify Installation

### 1. Backend Health Check
```bash
curl http://localhost:5000/health
# Expected: {"status":"OK","message":"Server is running"}
```

### 2. Swagger UI
Open browser: http://localhost:5000/api-docs

You should see the interactive API documentation.

### 3. Frontend
Open browser: http://localhost:3000

You should see the login page.

### 4. MongoDB Connection
```bash
# Test with mongosh
mongosh -u admin -p password --authenticationDatabase admin mongodb://localhost:27017

# In mongosh, run:
use expense-tracker
db.users.findOne()
# Should return null or a user object
```

---

## Development Workflow

### Terminal 1: Backend
```bash
cd back-end
npm run build  # Initial build
npm start      # Watch mode (rebuilds on file changes)
```

### Terminal 2: Frontend
```bash
cd front-end
npm start      # Watch mode with hot reload
```

### Terminal 3: Database Monitoring (Optional)
```bash
# Use MongoDB Compass or mongosh
mongosh -u admin -p password mongodb://localhost:27017
```

---

## Testing the API

### 1. Register User
```bash
curl -X POST http://localhost:5000/v1/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/v1/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create Transaction
```bash
TOKEN="your-access-token-here"

curl -X POST http://localhost:5000/v1/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coffee",
    "date": "2024-11-12",
    "category": "Food",
    "option": "EXPENSE",
    "price": 5.50,
    "method": "Credit Card"
  }'
```

---

## Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

**Frontend (Port 3000):**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Error

**Check MongoDB is Running:**
```bash
# With Docker
docker ps | grep mongodb

# With Homebrew
brew services list | grep mongodb

# With Atlas
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Verify username/password
```

**Test Connection:**
```bash
mongosh mongodb://admin:password@localhost:27017
```

### Backend Won't Start

```bash
# 1. Check Node version
node --version  # Should be 18+

# 2. Clear cache and reinstall
cd back-end
rm -rf node_modules dist
npm install
npm run build

# 3. Check for port conflicts
lsof -i :5000

# 4. Check .env file
cat .env.local

# 5. View detailed error
npm start
```

### Frontend Won't Start

```bash
# 1. Check Node version
node --version  # Should be 18+

# 2. Clear cache and reinstall
cd front-end
rm -rf node_modules build
npm install

# 3. Check React scripts
which react-scripts

# 4. Start with verbose output
npm start -- --verbose
```

### TypeScript Errors

```bash
cd back-end

# Rebuild
npm run build

# Check for errors
npx tsc --noEmit

# Clean and rebuild
rm -rf dist
npm run build
```

### Database Issues

```bash
# Clear MongoDB data and restart (Docker)
docker-compose down -v
docker-compose up -d

# Clear MongoDB data locally
mongosh
# In mongosh:
use admin
db.dropDatabase()
```

---

## Performance Tips

### 1. Use MongoDB Indexes
Indexes are already created. Verify with:
```bash
mongosh mongodb://admin:password@localhost:27017

use expense-tracker
db.transactions.getIndexes()
```

### 2. Optimize Frontend
```bash
# Build optimized bundle
cd front-end
npm run build

# Check bundle size
npx source-map-explorer 'build/static/js/*.js'
```

### 3. Monitor Backend
```bash
# Check memory usage
npm install -g clinic

cd back-end
clinic doctor -- npm start
```

---

## Environment Variables

### Backend (.env.local)
```
NODE_ENV=development
PORT=5000
DB_URL=mongodb://admin:password@localhost:27017/expense-tracker
JWT_SECRET=dev-secret-key
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Next Steps

1. ✓ Backend running on port 5000
2. ✓ Frontend running on port 3000
3. ✓ MongoDB running and connected
4. → Test API with Swagger UI
5. → Create test account
6. → Add test transactions
7. → Check dashboard and reports

---

## Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f mongodb
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend

# Stop all services
docker-compose stop

# Stop and remove (keeps data)
docker-compose down

# Stop, remove, and delete data
docker-compose down -v

# Rebuild images
docker-compose up -d --build
```

---

## Additional Resources

- **API Documentation:** http://localhost:5000/api-docs
- **Testing Guide:** See TESTING_GUIDE.md
- **Deployment:** See DEPLOYMENT.md
- **Full API Docs:** See API_DOCUMENTATION.md

---

## Support

If you encounter issues:
1. Check relevant section in Troubleshooting
2. Review application logs
3. Check GitHub repository
4. Verify all prerequisites are installed
