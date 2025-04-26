import { ReportRequest, FilterOperator } from '../types/reportRequest';

const validOperators: FilterOperator[] = ['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'like'];

export const validateReportRequest = (request: ReportRequest): string[] => {
    const errors: string[] = [];

    if (!request.tableName || typeof request.tableName !== 'string') {
        errors.push('Invalid or missing tableName.');
    }

    if (request.columns) {
        if (!Array.isArray(request.columns) || request.columns.some(col => typeof col !== 'string')) {
            errors.push('Columns must be an array of strings.');
        }
    }

    if (request.filters) {
        if (!Array.isArray(request.filters)) {
            errors.push('Filters must be an array.');
        } else {
            request.filters.forEach((filter, index) => {
                if (typeof filter.column !== 'string') {
                    errors.push(`Filter at index ${index} has invalid column.`);
                }
                if (!validOperators.includes(filter.operator as FilterOperator)) {
                    errors.push(`Filter at index ${index} has invalid operator '${filter.operator}'.`);
                }
                if (filter.value === undefined) {
                    errors.push(`Filter at index ${index} has missing value.`);
                }
            });
        }
    }

    if (request.orderBys) {
        if (!Array.isArray(request.orderBys)) {
            errors.push('OrderBys must be an array.');
        } else {
            request.orderBys.forEach((orderBy, index) => {
                if (typeof orderBy.column !== 'string') {
                    errors.push(`OrderBy at index ${index} has invalid column.`);
                }
                if (orderBy.order !== 'asc' && orderBy.order !== 'desc') {
                    errors.push(`OrderBy at index ${index} must have order 'asc' or 'desc'.`);
                }
            });
        }
    }

    return errors;
};
