export interface Filter {
    column: string;
    operator: FilterOperator;
    value: unknown;
}

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like';

export interface ReportRequest {
    tableName: string;
    columns?: string[];
    filters?: Filter[];
}