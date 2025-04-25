import { getPool } from '../db';
import Excel from 'exceljs';

export const generateExcelReport = async (tableName: string): Promise<Buffer> => {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM ${tableName}`);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(tableName);

    const rows = result.recordset;
    const columns = Object.keys(rows[0] || {}).map(key => ({ header: key, key }));

    worksheet.columns = columns;
    rows.forEach(row => worksheet.addRow(row));

    const buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
};
