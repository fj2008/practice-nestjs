import { FluentClient, EventTime } from '@fluent-org/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, request, Request } from 'express';
import { TestInterface } from './interface/fluent';
import { FluentTagEnum } from './user/enum/fluent.tag.enum';
import { FluentConfig } from './utils/fluentd';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {
    this.logger = new FluentConfig().ConfigFlunt();
  }
  private logger: FluentClient;
  use(req: Request, res: Response, next: NextFunction) {
    const tag: TestInterface = { error: 'error' };
    // const requestdata = (req)
    console.dir(req.headers.host);
    if (req.method !== 'GET') {
      this.logger.emit(tag.error, {
        data: '나실행되고있습니까?',
        method: req.method,
        host: req.hostname,
        url: req.originalUrl,
        body: JSON.stringify(req.body),
      });

      next();
    } else {
      this.logger.emit(tag.error, {
        data: '나실행되고있습니까?',
        method: req.method,
        host: req.hostname,
        url: req.originalUrl,
      });
      next();
    }
  }
}
