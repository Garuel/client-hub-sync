import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseApiDto } from '../../domain/classes/base-response-api.class';

export const ApiResponseWithData = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiExtraModels(ResponseApiDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ResponseApiDto) },
                    { properties: { data: { $ref: getSchemaPath(model) } } },
                ],
            },
        }),
    );
};



export const ApiResponseWithPrimitive = (type: 'string' | 'number' | 'boolean') => {
    return applyDecorators(
        ApiExtraModels(ResponseApiDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ResponseApiDto) },
                    {
                        properties: {
                            data: { type },
                        },
                    },
                ],
            },
        }),
    );
};


export const ApiResponseWithArrayData = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiExtraModels(ResponseApiDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ResponseApiDto) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};

export const ApiResponseWithoutData = () => {
    return applyDecorators(
        ApiExtraModels(ResponseApiDto),
        ApiOkResponse({
            description: 'Operación exitosa sin retorno de datos',
            schema: {
                $ref: getSchemaPath(ResponseApiDto),
            },
        }),
    );
};