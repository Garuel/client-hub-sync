
export interface IServicePagination {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
}

export interface IServicePaginatedResult<T> {
    results: T[];
    pagination: IServicePagination;
}