import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
      AppService,
    {
      provide: 'SEND_Q_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('AMQP')],
            queue: 'tasks',
            persistent: true,
            serializer: {
              serialize({ data }) {
                const result = {
                  ...data
                };

                if (data.options) {
                  result._options = data.options;
                  delete result.options;
                }

                return result;
              }
            }
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
