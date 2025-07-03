import {
  Injectable,
  Inject,
  OnModuleInit,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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

  private async enviarProductoCreado(producto: any) {
    this.gatewayClient.emit('producto_creado', producto);
  }

  async crearProducto(data: any) {
    try {
      const nuevoProducto = await this.prisma.producto.create({
        data,
      });
      await this.enviarProductoCreado(nuevoProducto);
      return nuevoProducto;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El nombre del producto ya existe.');
      }
      throw error;
    }
  }

  async obtenerProductoPorId(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return producto;
  }
}
