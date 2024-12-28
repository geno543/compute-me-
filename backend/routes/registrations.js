const express = require('express');
const router = express.Router();
const db = require('../config/database');
const validator = require('validator');

// Create new registration
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone, university, track, experience, skills, teamPreference, motivation } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email address'
            });
        }

        // Check if email already exists
        const [existing] = await db.query('SELECT id FROM registrations WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Insert new registration
        const [result] = await db.query(
            `INSERT INTO registrations 
            (fullName, email, phone, university, track, experience, skills, teamPreference, motivation) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullName, email, phone, university, track, experience, skills, teamPreference, motivation]
        );

        res.status(201).json({
            status: 'success',
            data: {
                id: result.insertId,
                ...req.body
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create registration'
        });
    }
});

// Get all registrations
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [registrations] = await db.query(
            'SELECT * FROM registrations ORDER BY registrationDate DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [total] = await db.query('SELECT COUNT(*) as count FROM registrations');

        res.json({
            status: 'success',
            data: registrations,
            pagination: {
                current: page,
                pages: Math.ceil(total[0].count / limit),
                total: total[0].count
            }
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch registrations'
        });
    }
});

// Get registration by ID
router.get('/:id', async (req, res) => {
    try {
        const [registration] = await db.query(
            'SELECT * FROM registrations WHERE id = ?',
            [req.params.id]
        );

        if (registration.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Registration not found'
            });
        }

        res.json({
            status: 'success',
            data: registration[0]
        });
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch registration'
        });
    }
});

// Update registration status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status'
            });
        }

        const [result] = await db.query(
            'UPDATE registrations SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Registration not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update status'
        });
    }
});

module.exports = router;
