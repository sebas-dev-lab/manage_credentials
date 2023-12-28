import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const ex: any = exception.getResponse();
    const status = exception.getStatus();
    Logger.error(
      JSON.stringify({
        exception,
        url: request.originalUrl,
      }),
    );

    // ========== Select url path to set patternController ============ //
    let url = request.originalUrl.split('/')[3];
    if (url && url.includes('?')) url = url.split('?')[0];
    

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url && request.url != '/' ? request.url : `/api/v1/${url}`,
      error: true,
      status,
      ...(ex &&
        ex.message && {
          message: ex.message,
        }),
      ...(ex &&
        ex.error && {
          type_error: ex.error,
        }),
    });
  }
}
