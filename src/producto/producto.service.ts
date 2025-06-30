import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductoService implements OnModuleInit {
  constructor(
    @Inject('GATEWAY') private readonly gatewayClient: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.gatewayClient.connect();
  }

  async enviarProductoCreado(producto: any) {
    this.gatewayClient.emit('producto_creado', producto);
  }

  async crearProducto(data: any) {
    const nuevoProducto = await this.prisma.producto.create({
      data,
    });
    await this.enviarProductoCreado(nuevoProducto);
    return nuevoProducto;
  }
}
