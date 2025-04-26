export type FilterOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like';

export interface Filter {
    column: string;
    operator: FilterOperator;
    value: unknown;
}

export type OrderDirection = 'asc' | 'desc';

export interface OrderBy {
    column: string;
    order: OrderDirection;
}

export interface ReportRequest {
    tableName: string;
    columns?: string[];
    filters?: Filter[];
    orderBys?: OrderBy[];
}
