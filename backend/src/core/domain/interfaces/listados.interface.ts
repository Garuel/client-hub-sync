export interface IPaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IPaginatedResponse<T> {
    success: boolean;
    message?: string;
    data: T[];
    meta: IPaginationMeta;
}

export interface IListResponse<T> {
    success: boolean;
    message?: string;
    data: T[];
}