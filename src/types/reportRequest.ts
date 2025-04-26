export interface Filter {
    column: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like';
    value: unknown;
}

export interface ReportRequest {
    tableName: string;
    columns?: string[];
    filters?: Filter[];
}