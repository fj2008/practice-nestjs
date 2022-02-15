import { FluentClient, EventTime } from '@fluent-org/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { FluentConfig } from './utils/fluentd';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {
    this.logger = new FluentConfig().ConfigFlunt();
  }
  private logger: FluentClient;
  use(req: Request, res: Response, next: NextFunction) {
    // console.dir(req, { depth: 1 });

    console.log();
    if (req.method !== 'GET') {
      this.logger.emit('error', {
        method: req.method,
        host: req.hostname,
        url: req.originalUrl,
        body: JSON.stringify(req.body),
        ip: req.ip,
      });

      next();
    } else {
      this.logger.emit('error', {
        method: req.method,
        host: req.hostname,
        url: req.originalUrl,
        body: JSON.stringify(req.body),
        ip: req.ip,
      });
      next();
    }
  }
}
