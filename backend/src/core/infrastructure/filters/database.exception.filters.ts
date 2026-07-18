import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface PostgresDriverError {
  code?: string;
  detail?: string;
  table?: string;
}

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();


    const driverError = exception.driverError as PostgresDriverError | undefined;

    this.logger.error(
      `Database error [Code ${driverError?.code || 'unknown'}]: ${exception.message}`,
      exception.stack
    );


    if (driverError?.code === '23505') {
      response.status(HttpStatus.CONFLICT).json({
        success: false,
        error: 'Conflict',
        message: 'Uno o más de los registros enviados ya se encuentran registrados en el sistema.',
      });
      return;
    }

    if (driverError?.code === '23503') {
      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Bad Request',
        message: 'Operación inválida. Hay un problema de relación con otros registros.',
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Ocurrió un error inesperado al procesar los datos de almacenamiento.',
    });
  }
}
