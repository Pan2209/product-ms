import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'GATEWAY',
        transport: Transport.TCP,
        options: {
          host: '192.168.20.160',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
