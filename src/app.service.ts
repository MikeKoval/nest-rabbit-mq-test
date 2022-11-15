import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('SEND_Q_SERVICE') private queue: ClientProxy) {}

  getHello(): string {
    this.queue.emit('test', {
      name: 'test2',
    });

    return 'Hello World!';
  }
}
