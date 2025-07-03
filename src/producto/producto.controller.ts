import {Controller, Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async crearProducto(@Body() body: any) {
    const { name, price, description } = body;

    // Validaciones manuales
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestException('El nombre del producto es obligatorio y debe ser texto.');
    }

    if (typeof price !== 'number' || price <= 0) {
      throw new BadRequestException('El precio debe ser un número mayor a 0.');
    }

    try {
      return await this.productoService.crearProducto({ name, price, description });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El nombre del producto ya existe.');
      }
      throw new BadRequestException('Error al crear el producto.');
    }
  }

  @Get(':id')
  async obtenerProducto(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productoService.obtenerProductoPorId(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }
    return producto;
  }

  @MessagePattern('getProducts')
  obtenerProductoTCP(@Param('id', ParseIntPipe) id: number){
    const producto = this.productoService.obtenerProductoPorId(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }
    return producto;
  }

  @MessagePattern('getAllProducts')
  findAllProducts(){
    return this.productoService.getAllProducts()
  }
}
