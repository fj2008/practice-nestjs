import { FluentClient, EventTime } from '@fluent-org/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { TestInterface } from './interface/fluent';
import { FluentConfig } from './utils/fluentd';
import * as jwt from 'jsonwebtoken';
import { TestingModule } from '@nestjs/testing';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {
    this.logger = new FluentConfig().ConfigFlunt();
  }
  private logger: FluentClient;
  use(req: any, res: any, next: NextFunction) {
    const manageTag: TestInterface = { manage: 'manage' };
    const openTag: TestInterface = { open: 'open' };
    //서버 도메인 네임으로 분기처리를 하고 싶었는데 로컬에서 현제 배포중인 도메인네임으로 파싱이 잘 되는지 값을 확인할 수 없어서 보류했습니다.
    // 로그인이 된 상태의 사용자라면 어떤사용자가 어떤 api를 어떻게 사용했는지 남기는 로그
    try {
      const token = req.headers?.authorization;
      if (token !== undefined && token !== null && token !== '') {
        if (token.startsWith('Bearer ')) {
          jwt.verify(
            token.split('Bearer ')[1],
            process.env.JWT_SECRET,
            (err, result: any) => {
              console.dir(err);
              //로그인한 사용자 type에 따라서 저장하는 컬렉션이 달라지도록 설정했습니다.
              console.dir(err === null);
              if (err === null) {
                const subtag =
                  result.type === 'manage' ? manageTag.manage : openTag.open;
                if (result && req.method !== 'GET') {
                  console.dir(4);
                  void this.logger.emit(subtag, {
                    method: req.method,
                    host: req.headers.host,
                    url: req.originalUrl,
                    body: JSON.stringify(req.body),
                    username: result.username,
                  });
                  next();
                } else {
                  console.dir(5 + subtag);
                  void this.logger.emit(subtag, {
                    method: req.method,
                    host: req.headers.host,
                    url: req.originalUrl,
                    username: result.username,
                  });
                  next();
                }
              } else {
                res.status(203).json({ state: 'ERROR', msg: '접근 권한 없음' });
                next();
              }
            },
          );
        }
      } else {
        res.status(203).json({ state: 'ERROR', msg: '접근 권한 없음' });
        next();
      }
    } catch (err: any) {
      console.dir(3);
      console.error(err);
      next();
    }
  }
}
