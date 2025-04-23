import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'Northwind',
    options: {
        encrypt: true, // set to true if you're connecting to Azure SQL
        trustServerCertificate: true, // set to true for local dev
    },
};

export const getPool = async (): Promise<sql.ConnectionPool> => {
    const pool = new sql.ConnectionPool(dbConfig);
    return pool.connect();
};
