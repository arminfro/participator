import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { NextService } from './nextjs/next.service';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly next: NextService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const data = {
      status: exception.getStatus(),
      message: exception.message,
      reqUrl: req.url,
    };

    // debugger;

    this.next.render(`/http-exception`, data, req, res);
  }
}
