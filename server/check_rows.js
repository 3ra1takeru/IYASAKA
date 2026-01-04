import pool from './db.js';

const checkRows = async () => {
    try {
        const connection = await pool.getConnection();
        const tables = ['vendors', 'time_slots', 'password_resets', 'admins'];
        for (const t of tables) {
            try {
                const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${t}`);
                console.log(`${t}: ${rows[0].count} rows`);
            } catch (e) {
                console.log(`${t}: Error - ${e.message}`);
            }
        }
        connection.release();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkRows();
