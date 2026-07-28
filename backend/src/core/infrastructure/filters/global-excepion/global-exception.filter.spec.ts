
import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { GlobalExceptionFilter } from './global-exception.filters';

describe('GlobalExceptionFilter', () => {
    let filter: GlobalExceptionFilter;

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const mockRequest = {
        url: '/api/v1/mantenimiento/migrar',
        method: 'POST',
    };

    const mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
            getResponse: () => mockResponse,
            getRequest: () => mockRequest,
        }),
    } as unknown as ArgumentsHost;

    beforeEach(() => {
        filter = new GlobalExceptionFilter();
        jest.clearAllMocks();
    });

    it('debe ser definido', () => {
        expect(filter).toBeDefined();
    });

    describe('Excepciones HTTP (HttpException)', () => {
        it('debe formatear correctamente una BadRequestException con mensaje simple', () => {
            const exception = new BadRequestException('El DNI es obligatorio');

            filter.catch(exception, mockArgumentsHost);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'El DNI es obligatorio',
                path: '/api/v1/mantenimiento/migrar',
                timestamp: expect.any(String),
            });
        });

        it('debe manejar un array de errores', () => {
            const exception = new BadRequestException({
                message: ['El campo nombre es requerido', 'El email debe ser válido'],
            });

            filter.catch(exception, mockArgumentsHost);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'El campo nombre es requerido, El email debe ser válido',
                path: '/api/v1/mantenimiento/migrar',
                timestamp: expect.any(String),
            });
        });
    });

    describe('Errores de Base de Datos (QueryFailedError)', () => {
        it('debe capturar el código PostgreSQL 23505 (Unique Constraint) y retornar HttpStatus.CONFLICT', () => {
            const driverError = { code: '23505', detail: 'Key (dni)=(123) already exists.' };
            const exception = new QueryFailedError('query', [], driverError as any);

            filter.catch(exception, mockArgumentsHost);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                statusCode: HttpStatus.CONFLICT,
                message: 'Uno o más registros ya se encuentran registrados en el sistema.',
                path: '/api/v1/mantenimiento/migrar',
                timestamp: expect.any(String),
            });
        });

        it('debe capturar el código PostgreSQL 23503 (Foreign Key) y retornar HttpStatus.BAD_REQUEST', () => {
            const driverError = { code: '23503', detail: 'Key (tipo_doc_id)=(99) not present in table.' };
            const exception = new QueryFailedError('query', [], driverError as any);

            filter.catch(exception, mockArgumentsHost);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Operación inválida. Hay un problema de relación con otros registros.',
                path: '/api/v1/mantenimiento/migrar',
                timestamp: expect.any(String),
            });
        });

        it('debe ofuscar mensajes técnicos si ocurre un QueryFailedError no mapeado', () => {
            const driverError = { code: '42703', detail: 'column "xyz" does not exist' };
            const exception = new QueryFailedError('SELECT * FROM xyz', [], driverError as any);

            filter.catch(exception, mockArgumentsHost);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ocurrió un error interno en el servidor. Por favor, intente más tarde.',
                path: '/api/v1/mantenimiento/migrar',
                timestamp: expect.any(String),
            });
        });
    });

    describe('Errores Genericos de Node.js (Error)', () => {
        it('debe capturar un Error no controlado y ofuscar la respuesta retornando 500', () => {
            const exception = new Error('Cannot read property of undefined');

            filter.catch(exception, mockArgumentsHost);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ocurrió un error interno en el servidor. Por favor, intente más tarde.',
                path: '/api/v1/mantenimiento/migrar',
                timestamp: expect.any(String),
            });
        });
    });
});