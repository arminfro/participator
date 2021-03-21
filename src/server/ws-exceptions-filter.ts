import { Catch, Inject, Logger, LoggerService } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {
    super();
  }

  catch(exception: Error /* host: ArgumentsHost */) {
    this.logger.warn(exception, 'WsExceptionsFilter');
  }
}
