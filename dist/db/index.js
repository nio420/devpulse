import { Pool } from "pg";
import config from "../config";
export const pool = new Pool({
    connectionString: config.databaseUrl,
});
export const initDB = async () => {
    try {
        // USERS TABLE
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // ISSUES TABLE
        await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log("Database initialized successfully!");
    }
    catch (error) {
        console.error("DATABASE ERROR:", error.message);
    }
};
//# sourceMappingURL=index.js.map