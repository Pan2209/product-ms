# 🛍️ Microservicio de Productos - `product-ms`

Este proyecto es un microservicio desarrollado con **NestJS** para gestionar productos dentro de un sistema distribuido. Forma parte de una arquitectura basada en microservicios y se comunica con un **Gateway** mediante protocolo **TCP**. Su función principal es registrar y consultar productos en una base de datos mediante **Prisma ORM** y emitir eventos al Gateway cuando se crea un nuevo producto.

---

## 🚀 ¿Cómo Funciona?

El microservicio expone dos endpoints REST:

* `POST /productos`: Crea un nuevo producto.
* `GET /productos/:id`: Consulta un producto existente por su ID.

Cuando se crea un producto, el microservicio:

1. Valida los datos manualmente (sin DTO).
2. Guarda el producto en la base de datos usando Prisma.
3. Emite un evento `producto_creado` al Gateway a través de comunicación TCP con los datos del producto recién creado.

También, cuando se consulta un producto por ID, lo recupera de la base de datos o devuelve un error si no existe.

---

## 🔁 Flujo de Datos

```text
Cliente REST → /productos (POST)
  └─> Valida datos manualmente
      └─> Prisma guarda en BD
          └─> Se emite evento 'producto_creado' vía TCP al Gateway

Cliente REST → /productos/:id (GET)
  └─> Prisma busca por ID
      └─> Retorna el producto o error 404 si no existe
```

---

## ⚙️ Tecnologías Usadas

| Tecnología        | Uso principal                                       |
| ----------------- | --------------------------------------------------- |
| **NestJS**        | Framework principal para construir el microservicio |
| **Prisma ORM**    | Manejo de base de datos y modelos                   |
| **Microservices** | Comunicación TCP con el Gateway (`ClientProxy`)     |
| **Node.js**       | Plataforma de ejecución backend                     |
| **TypeScript**    | Lenguaje principal para el desarrollo del servicio  |

---

## 🧱 ¿Cómo Fueron Usadas?

* **NestJS** se utilizó como núcleo del backend, permitiendo modularidad, inyección de dependencias y arquitectura escalable.
* **Prisma** fue usado para definir el modelo `Product`, generar migraciones y acceder a la base de datos de forma segura y eficiente.
* **ClientProxy (TCP)** permite al microservicio emitir eventos al Gateway (`producto_creado`) cada vez que se crea un nuevo producto.
* Las validaciones fueron implementadas manualmente dentro del controlador (no se usaron DTOs ni `class-validator`).

---

## 📁 Estructura del Proyecto

```bash
src/
├── prisma/
│   └── schema.prisma       # Definición del modelo Product
├── producto/
│   ├── producto.controller.ts # Controlador con endpoints
│   ├── producto.service.ts    # Lógica de negocio y comunicación TCP
│   └── producto.module.ts     # Configuración del microservicio y TCP Client
└── main.ts                    # Arranque de la aplicación NestJS
```

---

## 📡 Endpoints Disponibles

### 🔸 POST `/productos`

Crea un producto nuevo.

#### 📤 JSON de entrada:

```json
{
  "name": "Zapatos deportivos",
  "price": 75.50,
  "description": "Color negro, talla 42"
}
```

#### 📥 Respuestas:

* `201 Created`: Producto creado correctamente
* `400 Bad Request`: Faltan campos o datos inválidos
* `409 Conflict`: Nombre duplicado (único)

---

### 🔹 GET `/productos/:id`

Consulta un producto por su ID.

#### 📌 Ejemplo:

```bash
GET /productos/3
```

#### 📥 Respuestas:

* `200 OK`: Producto encontrado
* `404 Not Found`: No existe un producto con ese ID

---

## 🧩 Comunicación con el Gateway

Este microservicio está conectado con un Gateway TCP (otro microservicio NestJS). Al crear un producto, se emite:

```ts
this.gatewayClient.emit('producto_creado', nuevoProducto);
```

La conexión TCP se configura así en `producto.module.ts`:

```ts
ClientsModule.register([
  {
    name: 'GATEWAY',
    transport: Transport.TCP,
    options: {
      host: '192.168.20.76',
      port: 3001,
    },
  },
])
```

---

## 📦 Instalación y Uso

### 1️⃣ Clona el repositorio:

```bash
git clone https://github.com/Pan2209/product-ms.git
cd product-ms
```

### 2️⃣ Instala dependencias:

```bash
npm install
```

### 3️⃣ Configura la base de datos en el archivo `.env`:

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/productos_db"
```

### 4️⃣ Aplica las migraciones Prisma:

```bash
npx prisma migrate dev --name init
```

### 5️⃣ Ejecuta el microservicio:

```bash
npm run start:dev
```

---

## 🔧 Comandos Útiles

```bash
npm run start:dev      # Ejecutar en modo desarrollo
npm run build          # Compilar para producción
npx prisma studio      # Visualizador de la base de datos
```

---

## 📌 Pendientes y Mejoras Futuras

* [ ] Agregar DTOs y validación automática con `class-validator`
* [ ] Implementar `PATCH` y `DELETE` para productos
* [ ] Documentación Swagger (`@nestjs/swagger`)
* [ ] Tests unitarios e integración (Jest)
* [ ] Dockerización del servicio
* [ ] Retry y timeout para fallos de conexión TCP

---

## 👤 Autor

Desarrollado por **Pan2209**
Este microservicio forma parte de un sistema distribuido. ¡Feedback, sugerencias y PRs son bienvenidos!
