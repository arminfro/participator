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
      reqUrl: req.url,
    };

    const contentType = req.headers['content-type'];

    this.logger.warn(
      `${data.status} @ ${data.reqUrl} is ${data.message} from ${req.headers['referer']} with ${req.headers['user-agent']}`,
      'HttpExceptionsFilter',
    );

    // todo, use some on text/html,application/xhtml+xml,application/xml for next.render
    /\/json/.test(contentType)
      ? res.status(data.status).send(data)
      : this.next.render(`/http-exception`, data, req, res);
  }
}
