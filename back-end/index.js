require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Router = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error('ERROR: DB_URL environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(Router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'OK', message: 'Server is running' });
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).send({ error: 'Endpoint not found' });
});

// Connect to database and start server
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Database connected`);
    });
  })
  .catch((err) => {
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  });
