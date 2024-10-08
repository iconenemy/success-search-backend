import { ConfigService } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RabbitMQService } from './rabbitmq.service';
import { RegisterOption } from './rabbitmq.register.type';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {
  static register(names: RegisterOption): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.registerAsync(
          names.map((name) => ({
            name,
            useFactory: async (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
                queue: configService.get<string>(`RABBITMQ_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          })),
        ),
      ],
      exports: [ClientsModule],
    };
  }
}
