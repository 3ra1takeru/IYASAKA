import express from 'express';
import pool from '../db.js';

const router = express.Router();

// --- Events ---

// Get all events
router.get('/events', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events ORDER BY eventDate ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create event (simple for demo/admin)
router.post('/events', async (req, res) => {
    const { title, description, eventDate, location, price, imageUrl, isAdmissionFeeRequired, advanceTicketPrice, sameDayTicketPrice } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO events (title, description, eventDate, location, price, imageUrl, isAdmissionFeeRequired, advanceTicketPrice, sameDayTicketPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, eventDate, location, price, imageUrl, isAdmissionFeeRequired, advanceTicketPrice, sameDayTicketPrice]
        );
        res.status(201).json({ id: result.insertId, message: 'Event created' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Services ---

// Get all services
router.get('/services', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT services.*, users.displayName as providerName FROM services JOIN users ON services.providerId = users.id');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create service
router.post('/services', async (req, res) => {
    const { providerId, title, description, price, imageUrl } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO services (providerId, title, description, price, imageUrl) VALUES (?, ?, ?, ?, ?)',
            [providerId, title, description, price, imageUrl]
        );
        res.status(201).json({ id: result.insertId, message: 'Service created' });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
