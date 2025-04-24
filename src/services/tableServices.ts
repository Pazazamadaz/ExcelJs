import { getPool } from '../db';
import {mapToGeneralType} from "../utils/dataTypeMapper";

export const getAllTableNames = async (): Promise<string[]> => {
    const pool = await getPool();
    const result = await pool.request().query(`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME
  `);

    return result.recordset.map(row => row.TABLE_NAME);
};

export const getTableSchema = async (tableName: string) => {
    const pool = await getPool();

    const result = await pool.request()
        .input('tableName', tableName)
        .query(`
      SELECT 
        COLUMN_NAME as name, 
        DATA_TYPE as type, 
        IS_NULLABLE as nullable
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = @tableName AND TABLE_SCHEMA = 'dbo'
      ORDER BY ORDINAL_POSITION
    `);

    return {
        table: tableName,
        columns: result.recordset.map(col => ({
            name: col.name,
            type: mapToGeneralType(col.type),
            originalType: col.type,
            nullable: col.nullable === 'YES',
        }))
    };
};
