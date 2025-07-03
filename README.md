🛍️ product‑ms
Microservicio de gestión de productos basado en NestJS, con almacenamiento en base de datos Prisma y emisión de eventos hacia un Gateway microservicio vía TCP.

📦 Tecnologías
NestJS (Node.js, TypeScript)

Prisma ORM con MySQL/PostgreSQL/SQLite

@nestjs/microservices para comunicación TCP (ClientProxy / Gateway)

Validación básica manual en controlador (sin DTO)

Manejo de errores HTTP (400, 404, 409)

🚀 Instalación
Clona el repositorio:

bash
Copiar
Editar
git clone https://github.com/Pan2209/product-ms.git
cd product-ms
Instala dependencias:

bash
Copiar
Editar
npm install
Configura .env con tus credenciales de base de datos. Ejemplo:

env
Copiar
Editar
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
Ejecuta migración Prisma:

bash
Copiar
Editar
npx prisma migrate dev --name init_products
⚙️ Estructura del proyecto
graphql
Copiar
Editar
src/
├── prisma/
│   └── schema.prisma       # Modelo Product
├── producto/
│   ├── dto/                # DTOs (opcional, no usado actualmente)
│   ├── producto.controller.ts
│   ├── producto.service.ts
│   └── producto.module.ts
└── main.ts                 # Arranque de la app NestJS
📌 Uso
Crear un producto
Endpoint: POST /productos

Body JSON:

json
Copiar
Editar
{
  "name": "Nombre del producto",
  "price": 100.5,
  "description": "Descripción opcional"
}
Respuestas:

201 Created: producto creado y enviado vía evento producto_creado

400 Bad Request: datos inválidos

409 Conflict: nombre duplicado

Consultar un producto por ID
Endpoint: GET /productos/:id

Respuestas:

200 OK: devuelve el producto

404 Not Found: si no existe

🧩 Comunicación con Gateway
Se utiliza ClientProxy de NestJS con transporte TCP:

ts
Copiar
Editar
ClientsModule.register([
  {
    name: 'GATEWAY',
    transport: Transport.TCP,
    options: { host: '192.168.20.76', port: 3001 },
  },
]);
Al crear un producto se emite el evento:

ts
Copiar
Editar
gatewayClient.emit('producto_creado', nuevoProducto);
🛠️ Notas / Siguientes pasos
Agregar DTOs con class-validator para validación estructurada.

Implementar endpoints PATCH /productos/:id y DELETE /productos/:id.

Añadir pruebas unitarias/integración con Jest.

Incluir Swagger (@nestjs/swagger) para documentación automática.

Manejar mejor errores de conexión TCP o reintentos.

Considerar usar transacciones Prisma si se amplía la lógica.

📝 Scripts útiles
bash
Copiar
Editar
npm run start:dev      # modo desarrollo
npm run build          # construcción del proyecto
npm run start:prod     # modo producción
npx prisma studio      # interfaz visual de Prisma
👤 Autor
Pan2209 — Creador del microservicio de productos. ¡Feedback y mejoras bienvenidas!