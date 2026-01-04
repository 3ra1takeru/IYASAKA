import pool from './db.js';

const createTables = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database.');

    // 外部キーチェックを無効化して全削除してから作り直す
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Dropping tables...');
    await connection.query('DROP TABLE IF EXISTS reservations');
    await connection.query('DROP TABLE IF EXISTS services');
    await connection.query('DROP TABLE IF EXISTS events');
    await connection.query('DROP TABLE IF EXISTS messages');

    // Drop Legacy Tables
    await connection.query('DROP TABLE IF EXISTS time_slots');
    await connection.query('DROP TABLE IF EXISTS vendors');
    await connection.query('DROP TABLE IF EXISTS password_resets');
    await connection.query('DROP TABLE IF EXISTS password_reset_tokens');
    await connection.query('DROP TABLE IF EXISTS admins');

    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Users table
    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE users (
        id VARCHAR(255) NOT NULL,
        lineUserId VARCHAR(255),
        displayName VARCHAR(255),
        email VARCHAR(255),
        role VARCHAR(50),
        stripeAccountId VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Messages table
    console.log('Creating messages table...');
    await connection.query(`
      CREATE TABLE messages (
        id INT AUTO_INCREMENT NOT NULL,
        senderId VARCHAR(255) NOT NULL,
        receiverId VARCHAR(255) NOT NULL,
        content TEXT,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY messages_senderId_foreign (senderId),
        KEY messages_receiverId_foreign (receiverId),
        CONSTRAINT messages_senderId_foreign FOREIGN KEY (senderId) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT messages_receiverId_foreign FOREIGN KEY (receiverId) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Events table
    console.log('Creating events table...');
    await connection.query(`
      CREATE TABLE events (
        id INT AUTO_INCREMENT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        eventDate DATETIME,
        location VARCHAR(255),
        price DECIMAL(10, 2) DEFAULT 0,
        imageUrl VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Services table
    console.log('Creating services table...');
    await connection.query(`
      CREATE TABLE services (
        id INT AUTO_INCREMENT NOT NULL,
        providerId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) DEFAULT 0,
        imageUrl VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY services_providerId_foreign (providerId),
        CONSTRAINT services_providerId_foreign FOREIGN KEY (providerId) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Reservations table
    console.log('Creating reservations table...');
    await connection.query(`
      CREATE TABLE reservations (
        id INT AUTO_INCREMENT NOT NULL,
        userId VARCHAR(255) NOT NULL,
        type ENUM('event_ticket', 'exhibitor_fee', 'service') NOT NULL,
        targetId VARCHAR(255) NOT NULL, /* References events.id or services.id or 0 for fees */
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending', /* pending, paid, cancelled */
        stripePaymentIntentId VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY reservations_userId_foreign (userId),
        CONSTRAINT reservations_userId_foreign FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Tables created successfully.');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

createTables();
