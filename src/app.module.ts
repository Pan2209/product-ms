import { Module } from '@nestjs/common';
import { ProductoController } from './producto/producto.controller';
import { ProductoService } from './producto/producto.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductoModule } from './producto/producto.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GATEWAY',
        transport: Transport.TCP,
        options: {
          host: '192.168.20.76',  // IP del gateway
          port: 3001,              // Puerto del gateway
        },
      },
    ]),
    ProductoModule,
    PrismaModule,
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class AppModule {}
