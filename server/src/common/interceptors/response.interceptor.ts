import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const expressResponse = context
      .switchToHttp()
      .getResponse<ExpressResponse>();
    const statusCode = expressResponse.statusCode;

    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        statusCode,
        message: data?.message || 'Operation successful',
        data: data?.data !== undefined ? data.data : data,
      })),
    );
  }
}
