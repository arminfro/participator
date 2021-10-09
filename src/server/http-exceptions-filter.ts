import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { RenderableResponse } from 'nest-next';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<RenderableResponse>();
    const req = ctx.getRequest();

    const data = {
      status: String(exception.getStatus()),
      message: exception.message,
      path: req.url as string,
    };

    this.logger.warn(
      `${data.status} @ ${data.path} by ${data.message} from ${req.headers['referer']} with ${req.headers['user-agent']}`,
      'HttpExceptionsFilter',
    );

    res.render(`exception`, data);
  }
}
