import pool from './db.js';

const checkDb = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected.');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables);

        for (const t of tables) {
            const tableName = Object.values(t)[0];
            console.log(`--- ${tableName} ---`);
            try {
                const [create] = await connection.query(`SHOW CREATE TABLE ${tableName}`);
                console.log(create[0]['Create Table']);
            } catch (e) {
                console.log('Error showing create:', e.message);
            }
        }

        // Check for any foreign keys in information_schema
        const [fks] = await connection.query(`
        SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_SCHEMA = 'marche_db' 
        AND REFERENCED_TABLE_NAME = 'users';
    `);
        console.log('Foreign Keys referencing users:', fks);

        connection.release();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkDb();
