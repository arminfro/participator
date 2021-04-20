import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { NextService } from './nextjs/next.service';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly next: NextService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const data = {
      status: exception.getStatus(),
      message: exception.message,
      path: req.url,
    };

    this.logger.warn(
      `${data.status} @ ${data.path} is ${data.message} from ${req.headers['referer']} with ${req.headers['user-agent']}`,
      'HttpExceptionsFilter',
    );

    res.status(data.status);
    req.headers.accept
      ?.split(',')
      ?.some((mime: string) => mime.includes('html'))
      ? this.next.render(`/exception`, data, req, res)
      : res.status(data.status).send(data);
  }
}
