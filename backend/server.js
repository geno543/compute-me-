const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
db.query('SELECT 1')
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

// Import routes
const registrationRoutes = require('./routes/registrations');

// Use routes
app.use('/api/registrations', registrationRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
