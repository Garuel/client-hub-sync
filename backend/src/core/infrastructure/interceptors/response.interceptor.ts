// infrastructure/interceptors/response.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IListResponse, IPaginatedResponse } from 'src/core/domain/interfaces/listados.interface';
import { ResponseAPI } from 'src/core/domain/interfaces/response-api.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<any, IPaginatedResponse<any> | IListResponse<any> | ResponseAPI<any>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<IPaginatedResponse<any> | IListResponse<any> | ResponseAPI<any>> {
        return next.handle().pipe(
            map((response) => {

                if (response && response.results && response.pagination) {
                    const { results, pagination } = response;
                    return {
                        success: true,
                        data: results,
                        meta: {
                            totalItems: pagination.totalItems,
                            itemCount: results.length,
                            itemsPerPage: pagination.itemsPerPage,
                            totalPages: Math.ceil(pagination.totalItems / pagination.itemsPerPage),
                            currentPage: pagination.currentPage,
                        },
                    };
                }
                //Para response API
                if (response && (response.message !== undefined || response.tipoRespuesta !== undefined)) {
                    return {
                        success: true,
                        tipoRespuesta: response.tipoRespuesta,
                        title: response.title,
                        message: response.message,
                        data: response.data !== undefined ? response.data : null,
                    };
                }


                return {
                    success: true,
                    data: response || null,
                };
            }),
        );
    }
}