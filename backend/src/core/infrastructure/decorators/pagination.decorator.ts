import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiExtraModels(model),
        ApiOkResponse({
            schema: {
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            totalItems: { type: 'number', example: 100 },
                            itemCount: { type: 'number', example: 10 },
                            itemsPerPage: { type: 'number', example: 10 },
                            totalPages: { type: 'number', example: 10 },
                            currentPage: { type: 'number', example: 1 },
                        },
                    },
                },
            },
        })
    );
};