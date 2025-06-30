import { Controller, Post, Body } from '@nestjs/common';
import { ProductoService } from './producto.service';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async crear(@Body() data: any) {
    return this.productoService.crearProducto(data);
  }
}
