import { FluentClient } from '@fluent-org/logger';
import { EventRecord } from '@fluent-org/logger/build/src/protocol';

export class FluentConfig {
  serviceConfigFlunt(tag: string, log: EventRecord) {
    const logger = new FluentClient('api', {
      socket: {
        host: 'localhost',
        port: 24223,
      },
    });
    const timestemp = new Date();
    return logger.emit(tag, log, timestemp);
  }

  ConfigFlunt() {
    const logger = new FluentClient('api', {
      socket: {
        host: 'localhost',
        port: 24223,
      },
    });
    return logger;
  }

  hostConfigFlunt(tag: string, log: EventRecord) {
    const logger = new FluentClient('host', {
      socket: {
        host: 'localhost',
        port: 24223,
      },
    });
    const timestemp = new Date();
    return logger.emit(tag, log, timestemp);
  }
}
