export interface ResponseAPI<T = {}> {
    success: boolean;
    data: T;
    message?: string;
}
