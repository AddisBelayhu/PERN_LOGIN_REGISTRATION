import {pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();
//it is a group of reusable databse connetions so our apps handle multiple requests efficiently
const pool = new pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

pool.on("connect", () => {
    console.log("Connect to the database");
});

pool.on("error", (err) => {
    console.error("Database error", err);
});

export default pool;
