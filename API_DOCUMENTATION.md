# Expense Tracker API Documentation

Complete API documentation for the Expense Tracker application.

## Quick Start

### Access Swagger UI
```
http://localhost:5000/api-docs
```

The interactive Swagger UI allows you to:
- View all endpoints with descriptions
- See request/response schemas
- Try API calls directly in the browser
- View error responses

## Authentication

All protected endpoints require a Bearer token in the Authorization header.

### Getting Started
1. **Register**: `POST /v1/api/auth/register`
2. **Login**: `POST /v1/api/auth/login`
3. **Use accessToken** in Authorization header: `Authorization: Bearer <accessToken>`
4. **Refresh**: Use refreshToken to get new accessToken when expired

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

### System

#### Health Check
```http
GET /health
```
**Public** - No authentication required

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### Authentication

#### Register User
```http
POST /v1/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /v1/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Refresh Token
```http
POST /v1/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### Transactions

#### Create Transaction
```http
POST /v1/api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Coffee",
  "date": "2024-11-12",
  "category": "Food",
  "option": "EXPENSE",
  "price": 5.50,
  "method": "Credit Card",
  "description": "Morning coffee",
  "tags": ["morning", "caffeine"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Coffee",
    "date": "2024-11-12",
    "category": "Food",
    "option": "EXPENSE",
    "price": 5.50,
    "method": "Credit Card",
    "description": "Morning coffee",
    "tags": ["morning", "caffeine"],
    "createdAt": "2024-11-12T10:00:00.000Z",
    "updatedAt": "2024-11-12T10:00:00.000Z"
  }
}
```

#### List Transactions
```http
GET /v1/api/transactions?limit=50&offset=0&sortBy=date&sortOrder=desc&startDate=2024-11-01&endDate=2024-11-30&category=Food&option=EXPENSE
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (string, YYYY-MM-DD) - Filter by start date
- `endDate` (string, YYYY-MM-DD) - Filter by end date
- `category` (string) - Filter by category
- `option` (string) - INCOME or EXPENSE
- `minPrice` (number) - Minimum amount
- `maxPrice` (number) - Maximum amount
- `search` (string) - Search in name or description
- `limit` (integer, default: 50) - Results per page
- `offset` (integer, default: 0) - Pagination offset
- `sortBy` (string, default: date) - date, price, or name
- `sortOrder` (string, default: desc) - asc or desc

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Coffee",
      "date": "2024-11-12",
      "category": "Food",
      "option": "EXPENSE",
      "price": 5.50,
      "method": "Credit Card"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "pages": 3
  }
}
```

#### Get Single Transaction
```http
GET /v1/api/transactions/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Coffee",
    "date": "2024-11-12",
    "category": "Food",
    "option": "EXPENSE",
    "price": 5.50,
    "method": "Credit Card",
    "description": "Morning coffee",
    "tags": ["morning"],
    "createdAt": "2024-11-12T10:00:00.000Z",
    "updatedAt": "2024-11-12T10:00:00.000Z"
  }
}
```

#### Update Transaction
```http
PATCH /v1/api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cappuccino",
  "price": 6.50,
  "category": "Beverages"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction updated",
  "data": { ... }
}
```

#### Delete Transaction
```http
DELETE /v1/api/transactions/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction deleted",
  "data": { "_id": "507f1f77bcf86cd799439011" }
}
```

---

### Dashboard

#### Monthly Summary
```http
GET /v1/api/dashboard/summary?month=11&year=2024
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpense": 1500.00,
    "netSavings": 3500.00,
    "transactionCount": 45,
    "month": 11,
    "year": 2024
  }
}
```

#### Current Balance
```http
GET /v1/api/dashboard/balance
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "currentBalance": 25000.00,
    "lastUpdated": "2024-11-12T15:30:00.000Z"
  }
}
```

#### Income vs Expense
```http
GET /v1/api/dashboard/income-vs-expense?months=6
Authorization: Bearer <token>
```

**Query Parameters:**
- `months` (integer, default: 6, max: 12) - Number of months to compare

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jun 2024",
      "income": 5000.00,
      "expense": 1200.00,
      "net": 3800.00
    },
    {
      "month": "Jul 2024",
      "income": 5000.00,
      "expense": 1500.00,
      "net": 3500.00
    }
  ]
}
```

#### Spending by Category
```http
GET /v1/api/dashboard/spending-by-category?month=11&year=2024
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Food",
        "amount": 450.00,
        "percentage": 30.0
      },
      {
        "category": "Transportation",
        "amount": 300.00,
        "percentage": 20.0
      }
    ],
    "totalSpent": 1500.00
  }
}
```

#### Recent Transactions
```http
GET /v1/api/dashboard/recent-transactions?limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Coffee",
      "date": "2024-11-12",
      "price": 5.50,
      "option": "EXPENSE"
    }
  ]
}
```

#### Yearly Summary
```http
GET /v1/api/dashboard/yearly-summary?year=2024
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "year": 2024,
    "totalIncome": 60000.00,
    "totalExpense": 18000.00,
    "netSavings": 42000.00,
    "transactionCount": 540,
    "averageMonthlyIncome": 5000.00,
    "averageMonthlyExpense": 1500.00
  }
}
```

---

### Budgets

#### Create Budget
```http
POST /v1/api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Food",
  "limit": 500.00,
  "period": "MONTHLY",
  "startDate": "2024-11-01",
  "endDate": "2024-11-30"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "user@example.com",
    "category": "Food",
    "limit": 500.00,
    "period": "MONTHLY",
    "startDate": "2024-11-01",
    "endDate": "2024-11-30",
    "spent": 150.00,
    "status": "UNDER"
  }
}
```

#### List Budgets
```http
GET /v1/api/budgets?period=MONTHLY
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string) - MONTHLY or YEARLY (optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "category": "Food",
      "limit": 500.00,
      "spent": 150.00,
      "status": "UNDER"
    }
  ]
}
```

#### Get Budget Details
```http
GET /v1/api/budgets/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "category": "Food",
    "limit": 500.00,
    "spent": 150.00,
    "status": "UNDER",
    "utilized": 30,
    "remaining": 350.00
  }
}
```

#### Update Budget
```http
PATCH /v1/api/budgets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "limit": 600.00,
  "period": "MONTHLY"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Budget updated",
  "data": { ... }
}
```

#### Delete Budget
```http
DELETE /v1/api/budgets/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Budget deleted",
  "data": { "_id": "507f1f77bcf86cd799439012" }
}
```

#### Budget Progress
```http
GET /v1/api/budgets/:id/progress
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "budgetId": "507f1f77bcf86cd799439012",
    "category": "Food",
    "period": "MONTHLY",
    "limit": 500.00,
    "spent": 400.00,
    "remaining": 100.00,
    "utilization": 80,
    "status": "WARNING",
    "warning": true,
    "message": "80% of budget used. $100.00 remaining"
  }
}
```

---

### Reports

#### Monthly Statement (JSON)
```http
GET /v1/api/reports/monthly-statement?month=11&year=2024&format=json
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "month": 11,
      "year": 2024,
      "startDate": "2024-11-01",
      "endDate": "2024-11-30"
    },
    "summary": {
      "totalIncome": 5000.00,
      "totalExpense": 1500.00,
      "netSavings": 3500.00,
      "transactionCount": 45
    },
    "breakdown": {
      "byCategory": [
        {
          "category": "Food",
          "expenses": 450.00,
          "percentage": 30.0
        }
      ],
      "byMethod": [
        {
          "method": "Credit Card",
          "total": 800.00,
          "count": 20
        }
      ],
      "byType": {
        "income": 5000.00,
        "expense": 1500.00
      }
    },
    "trends": {
      "previousMonth": {
        "totalIncome": 4800.00,
        "totalExpense": 1400.00,
        "netSavings": 3400.00
      },
      "monthOverMonthChange": {
        "income": 4.17,
        "expense": 7.14,
        "savings": 2.94
      }
    }
  }
}
```

#### Monthly Statement (CSV)
```http
GET /v1/api/reports/monthly-statement?month=11&year=2024&format=csv
Authorization: Bearer <token>
```

**Response (200):** CSV file download

#### Monthly Statement (PDF)
```http
GET /v1/api/reports/monthly-statement?month=11&year=2024&format=pdf
Authorization: Bearer <token>
```

**Response (200):** PDF file download

#### Export Transactions as CSV
```http
POST /v1/api/reports/export/csv
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2024-11-01",
  "endDate": "2024-11-30",
  "type": "transactions",
  "format": "csv",
  "pageSize": 1000,
  "page": 1
}
```

**Response (200):** CSV file with headers

#### Export as PDF
```http
POST /v1/api/reports/export/pdf
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2024-11-01",
  "endDate": "2024-11-30",
  "type": "statement",
  "format": "pdf",
  "includeCharts": true
}
```

**Response (200):** PDF file download

#### Custom Report
```http
GET /v1/api/reports/custom?startDate=2024-11-01&endDate=2024-11-30&reportType=summary
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (string, required, YYYY-MM-DD) - Start date
- `endDate` (string, required, YYYY-MM-DD) - End date
- `reportType` (string, default: summary) - summary, detailed, or comparison
- `groupBy` (string) - category, method, or date

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 6,
      "type": "string",
      "message": "String must contain at least 6 character(s)"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "error": "Access token required"
}
```

### Not Found (404)
```json
{
  "error": "Transaction not found"
}
```

### Server Error (500)
```json
{
  "error": "Failed to create transaction"
}
```

---

## Rate Limiting & Performance

- No rate limiting implemented (add in production)
- Max request body size: 10MB (default Express)
- Max CSV export: 100,000 rows
- Max PDF size: 50MB
- Database query timeout: 30 seconds

---

## Best Practices

### Pagination
Always use pagination for list endpoints:
```http
GET /v1/api/transactions?limit=50&offset=0
```

### Filtering
Use specific filters to reduce data:
```http
GET /v1/api/transactions?startDate=2024-11-01&category=Food&option=EXPENSE
```

### Date Format
Always use ISO 8601 format: `YYYY-MM-DD`

### Error Handling
Check `success` field first, then `error` or `data`:
```javascript
if (response.success) {
  // Use response.data
} else {
  // Handle response.error
}
```

---

## Code Examples

### JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/v1/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.accessToken;

// Create transaction
const transResponse = await fetch('http://localhost:5000/v1/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Coffee',
    date: '2024-11-12',
    category: 'Food',
    option: 'EXPENSE',
    price: 5.50,
    method: 'Credit Card'
  })
});

const transaction = await transResponse.json();
console.log(transaction.data);
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/v1/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create transaction
TOKEN="your-token-here"
curl -X POST http://localhost:5000/v1/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Coffee",
    "date":"2024-11-12",
    "category":"Food",
    "option":"EXPENSE",
    "price":5.50,
    "method":"Credit Card"
  }'
```

---

## Support

For issues or questions:
1. Check the error message and response details
2. Review this documentation
3. Check the Swagger UI at `/api-docs`
4. Review application logs
5. Open an issue on GitHub
