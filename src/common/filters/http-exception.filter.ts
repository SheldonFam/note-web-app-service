import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (typeof exResponse === 'object') {
        const res = exResponse as Record<string, unknown>;
        message = (res.message as string) ?? exception.message;

        if (Array.isArray(res.message)) {
          errors = this.formatValidationErrors(res.message as string[]);
          message = 'Validation failed';
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(errors && { errors }),
    });
  }

  private formatValidationErrors(messages: string[]): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    for (const msg of messages) {
      const parts = msg.split(' ');
      const field = parts[0];
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(msg);
    }
    return errors;
  }
}
