import { FluentClient } from '@fluent-org/logger';
import { EventRecord } from '@fluent-org/logger/build/src/protocol';
import { TestInterface } from 'src/interface/fluent';
export class FluentConfig {
  serviceConfigFlunt(tag: string, log: EventRecord) {
    const logger = new FluentClient('api', {
      socket: {
        host: '3.35.3.103',
        port: 24224,
      },
    });
    const timestemp = new Date();
    return logger.emit(tag, log, timestemp);
  }

  ConfigFlunt() {
    const tag: TestInterface = { api: 'api' };
    const logger = new FluentClient(tag.api, {
      socket: {
        host: '3.35.3.103',
        port: 24224,
      },
    });
    return logger;
  }
  emitFluent(logger: FluentClient) {
    logger.emit('asd', { date: 'asdfasdf' });
  }

  hostConfigFlunt(tag: string, log: EventRecord) {
    const logger = new FluentClient('host', {
      socket: {
        host: '3.35.3.103',
        port: 24224,
      },
    });
    const timestemp = new Date();
    return logger.emit(tag, log, timestemp);
  }
}
