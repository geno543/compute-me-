const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

// Read SQL file
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Execute SQL
connection.query(schema, (err, results) => {
    if (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
    console.log('Database initialized successfully');
    connection.end();
});
