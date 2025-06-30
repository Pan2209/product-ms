import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductoService } from '../src/producto/producto.service';

@Controller()
export class ProductoController {
constructor(private readonly productoService: ProductoService) {}

@EventPattern('crear_producto')
async manejarCreacionProducto(@Payload() data: any) {
return this.productoService.crearProducto(data);
}
}