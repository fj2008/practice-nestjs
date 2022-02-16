import { FluentClient, EventTime } from '@fluent-org/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
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
    if (req.method !== 'GET') {
      this.logger.emit(tag.error, {
        method: req.method,
        host: req.hostname,
        url: req.originalUrl,
        query: JSON.stringify(req.query),
        params: JSON.stringify(req.params),
        body: JSON.stringify(req.body),
        ip: req.ip,
      });

      next();
    } else {
      this.logger.emit(tag.error, {
        data: '나 실행되는것임?',

        method: req.method,
        host: req.hostname,
        url: req.originalUrl,
        query: JSON.stringify(req.query),
        params: JSON.stringify(req.params),
        body: JSON.stringify(req.body),
        ip: req.ip,
      });
      next();
    }
  }
}
