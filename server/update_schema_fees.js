import pool from './db.js';

const updateSchema = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected.');

        try {
            await connection.query(`
                ALTER TABLE events
                ADD COLUMN isAdmissionFeeRequired BOOLEAN DEFAULT FALSE,
                ADD COLUMN advanceTicketPrice INT DEFAULT NULL,
                ADD COLUMN sameDayTicketPrice INT DEFAULT NULL;
            `);
            console.log('Columns added to events table.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Columns already exist, skipping.');
            } else {
                throw e;
            }
        }

        connection.release();
        process.exit(0);
    } catch (e) {
        console.error('Error updating schema:', e);
        process.exit(1);
    }
};

updateSchema();
