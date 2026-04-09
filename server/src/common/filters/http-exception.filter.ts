import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      message =
        typeof responseBody === 'object' && responseBody !== null
          ? (responseBody as any).message || exception.message
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      errorSources: Array.isArray(message) ? message : [message],
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    });
  }
}
