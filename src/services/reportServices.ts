import { getPool } from '../db';
import Excel from 'exceljs';
import { ReportRequest } from '../types/reportRequest';

export const generateExcelReport = async (
    request: ReportRequest
): Promise<Buffer> => {
    const pool = await getPool();

    const selectedColumns = request.columns && request.columns.length > 0
        ? request.columns.map(col => `[${col}]`).join(', ')
        : '*';

    let query = `SELECT ${selectedColumns} FROM ${request.tableName}`;

    if (request.filters && request.filters.length > 0) {
        const conditions = request.filters.map(filter => {
            const operatorMap: Record<string, string> = {
                eq: '=',
                ne: '<>',
                gt: '>',
                lt: '<',
                gte: '>=',
                lte: '<=',
                like: 'LIKE'
            };

            const sqlOperator = operatorMap[filter.operator] || '=';

            const formattedValue = typeof filter.value === 'string'
                ? `'${filter.value}'`
                : filter.value;

            return `[${filter.column}] ${sqlOperator} ${formattedValue}`;
        });

        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await pool.request().query(query);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(request.tableName);

    const rows = result.recordset;
    const excelColumns = Object.keys(rows[0] || {}).map(key => ({ header: key, key }));

    worksheet.columns = excelColumns;
    rows.forEach(row => worksheet.addRow(row));

    const buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
};
