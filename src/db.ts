import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'Northwind',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export const getPool = async (): Promise<sql.ConnectionPool> => {
    const pool = new sql.ConnectionPool(dbConfig);
    return pool.connect();
};

