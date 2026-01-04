import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import paymentsRouter from './routes/payments.js';
import messagesRouter from './routes/messages.js';

import productsRouter from './routes/products.js';
import reservationsRouter from './routes/reservations.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payments', paymentsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api', productsRouter); // For /events and /services
app.use('/api/reservations', reservationsRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'IYASAKA Backend is running' });
});

app.get('/api/db-check', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 as result');
        res.json({ status: 'ok', message: 'Database connection successful', result: rows[0] });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
