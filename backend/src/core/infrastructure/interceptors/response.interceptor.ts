
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApiDto } from 'src/core/domain/classes/base-response-api.class';
import { IListResponse, IPaginatedResponse } from 'src/core/domain/interfaces/listados.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<any, IPaginatedResponse<any> | IListResponse<any> | ResponseApiDto<any>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<IPaginatedResponse<any> | IListResponse<any> | ResponseApiDto<any>> {
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