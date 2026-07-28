import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message, isOperational } = this.parseException(exception);

        this.logger.error(`[${request.method}] ${request.url} - Status: ${status}`);
        if (exception instanceof Error) {
            this.logger.error(exception.stack);
        }

        const clientMessage = isOperational
            ? message
            : 'Ocurrió un error interno en el servidor. Por favor, intente más tarde.';

        response.status(status).json({
            success: false,
            statusCode: status,
            message: clientMessage,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }


    private parseException(exception: unknown): { status: number; message: string; isOperational: boolean } {

        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            const message = typeof response === 'object' ? (response as any).message : exception.message;
            return {
                status: exception.getStatus(),
                message: Array.isArray(message) ? message.join(', ') : message,
                isOperational: true
            };
        }

        if (exception instanceof QueryFailedError) {
            const driverError = exception.driverError as any;

            if (driverError?.code === '23505') {
                return {
                    status: HttpStatus.CONFLICT,
                    message: 'Uno o más registros ya se encuentran registrados en el sistema.',
                    isOperational: true
                };
            }

            if (driverError?.code === '23503') {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Operación inválida. Hay un problema de relación con otros registros.',
                    isOperational: true
                };
            }
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
            isOperational: false
        };
    }
}