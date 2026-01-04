import express from 'express';
import pool from '../db.js';
import { Client } from '@line/bot-sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const router = express.Router();

// LINE Client Configuration
let client;
try {
    if (process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_CHANNEL_SECRET) {
        client = new Client({
            channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.LINE_CHANNEL_SECRET,
        });
    }
} catch (e) {
    console.warn("INVALID LINE CONFIG:", e);
}

// Send a message
router.post('/', async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Save to Database
        const [result] = await pool.query(
            'INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)',
            [senderId, receiverId, content]
        );

        const messageId = result.insertId;

        // 2. Send LINE Notification (if receiver has lineUserId)
        try {
            const [users] = await pool.query(
                'SELECT lineUserId, displayName FROM users WHERE id = ?',
                [receiverId]
            );

            if (users.length > 0 && users[0].lineUserId) {
                const receiver = users[0];

                // Get sender info for notification
                const [senders] = await pool.query('SELECT displayName FROM users WHERE id = ?', [senderId]);
                const senderName = senders.length > 0 ? senders[0].displayName : '誰か';

                if (client) {
                    await client.pushMessage(receiver.lineUserId, {
                        type: 'text',
                        text: `【IYASAKA】${senderName}さんからメッセージが届きました。\n\n"${content}"\n\nアプリを確認してください: https://os3-318-48990.vs.sakura.ne.jp/iyasaka/`
                    });
                    console.log(`LINE notification sent to ${receiver.displayName} (${receiver.lineUserId})`);
                }
            }
        } catch (lineError) {
            console.warn('Failed to send LINE notification:', lineError.message);
            // Do not fail the request if notification fails
        }

        res.status(201).json({ id: messageId, success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get messages between two users
router.get('/:userId/:otherUserId', async (req, res) => {
    const { userId, otherUserId } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT * FROM messages 
             WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
             ORDER BY createdAt ASC`,
            [userId, otherUserId, otherUserId, userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
