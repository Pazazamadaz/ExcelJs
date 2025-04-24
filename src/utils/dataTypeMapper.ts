export const mapToGeneralType = (sqlType: string): 'number' | 'string' | 'boolean' | 'date' | 'unknown' => {
    const type = sqlType.toLowerCase();

    if (['int', 'bigint', 'smallint', 'tinyint', 'decimal', 'numeric', 'float', 'real', 'money', 'smallmoney'].includes(type)) {
        return 'number';
    }

    if (['varchar', 'nvarchar', 'char', 'nchar', 'text', 'ntext', 'uniqueidentifier'].includes(type)) {
        return 'string';
    }

    if (['bit'].includes(type)) {
        return 'boolean';
    }

    if (['date', 'datetime', 'datetime2', 'smalldatetime', 'time', 'datetimeoffset'].includes(type)) {
        return 'date';
    }

    return 'unknown';
};
