# ShopBot 🤖

> Asistente virtual con IA para tiendas de ropa - Potenciado por Google Gemini

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-12%20passing-green?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)]()

---

## 📋 Índice

- [Descripción](#descripción)
- [Características](#características)
- [Tech Stack](#tech-stack)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Base de Datos](#base-de-datos)
- [Arquitectura](#arquitectura)
- [Testing](#testing)
- [Desarrollo](#desarrollo)
- [Producción](#producción)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Descripción

**ShopBot** es un asistente virtual inteligente para tiendas de ropa, diseñado para automatizar la atención al cliente 24/7. Utiliza IA generativa (Google Gemini) para responder consultas sobre productos, disponibilidad, talles, precios, envíos y más.

### Caso de Uso

```
Cliente → "¿Qué talles tienen en mujer?" → ShopBot → "Manejamos de XS al XXL..."
         → "¿Envíos a CABA?"             → ShopBot → "Sí, los lunes, miércoles..."
         → "¿Puedo pagar con Mercado Pago?" → ShopBot → "Sí, acepto MP QR..."
```

---

## Características

### 🤖 Chat Inteligente
- Respuestas automáticas con IA generativa (Gemini 2.5 Flash)
- Tono cálido y cercano (personalizable en `tienda-config.ts`)
- Soporte para imágenes de productos
- Historial de conversación persistente
- Menú rápido de categorías

### 📦 Gestión de Productos
- CRUD completo de productos
- Categorización (Mujer, Hombre, Niños)
- Gestión de talles y stock
- Upload de imágenes con preview
- Búsqueda y filtros por estado

### 💰 Sistema de Reservas y Ventas
- Estados: disponible → reservado → vendido
- Gestión de reservas con fecha de vencimiento
- Historial de ventas con método de pago
- Liberación de productos (devolver a disponible)

### 💬 Consultas de Clientes
- Registro automático de conversaciones
- Filtros por fecha y estado
- Marcar consultas como atentidas
- Exportar a CSV

### 🛡️ Seguridad
- Autenticación en panel admin (cookie-based)
- Rate limiting (Upstash Redis)
- Validación de inputs
- 10 requests/minuto por IP

### ✅ Calidad
- 12 tests unitarios y de integración
- TypeScript strict mode
- Build optimizado
- 30 productos de ejemplo con imágenes

---

## Capturas de Pantalla

### Chat Bot
![Bot](/screenshots/bot.png)
![Bot Móvil](/screenshots/mobile.png)
![Modal](/screenshots/modal.png)

### Panel de Administración
![Login](/screenshots/login.png)
![Dashboard](/screenshots/panel.png)
![Gestión Productos](/screenshots/panel2.png)
![Consultas](/screenshots/consultas.png)

---

## Tech Stack

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | [Next.js](https://nextjs.org) | 16.1.6 |
| UI | [React](https://react.dev) | 19 |
| Lenguaje | [TypeScript](https://typescriptlang.org) | 5.x |
| Estilos | [Tailwind CSS](https://tailwindcss.com) | 4 |
| Base de datos | [SQLite](https://www.sqlite.org) | 3 |
| Cliente BD | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | 12.x |
| IA | [Google Gemini](https://ai.google.dev) | 2.5 Flash |
| Rate Limiting | [Upstash Redis](https://upstash.com) | - |
| Testing | [Vitest](https://vitest.dev) | 4.x |

---

## Requisitos

- **Node.js**: 18.x o superior
- **npm**: 9.x o superior
- **Google AI Studio API Key** (gratuita, para Gemini)

---

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd ploshito-bot

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Cargar datos de ejemplo

```bash
npm run seed
```

Esto carga 30 productos de ejemplo (10 por categoría: Mujer, Hombre, Niños) con imágenes de Unsplash.

---

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google Gemini API (requerido)
GEMINI_API_KEY=your_gemini_api_key_here

# Upstash Redis (opcional - rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Admin Panel
ADMIN_PASSWORD=demo123

# Database (opcional, por defecto usa SQLite local)
DATABASE_URL=file:./dev.db
```

### Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com)
2. Inicia sesión con tu cuenta de Google
3. Ve a **Get API Key** → **Create API Key**
4. Copia la key y agrégala a `.env.local`

> **Nota:** La API gratuita tiene límite de 15 requests/minuto, suficiente para desarrollo.

### Mejorar Velocidad e Inteligencia

El modelo actual es **Gemini 2.5 Flash** (gratuito). Para mayor velocidad e inteligencia:

1. **Más velocidad**: Cambia a **Gemini 2.0 Flash** o **Gemini 2.5 Pro** en `src/app/api/chat/route.ts`
2. **Más requests/minuto**: Obtén una **API key de pago** en [Google AI Studio](https://aistudio.google.com/app/apikey)
3. **Otros proveedores**: Podés integrar OpenAI, Anthropic, o Azure OpenAI modificando `src/app/api/chat/route.ts`

```typescript
// En src/app/api/chat/route.ts - cambiar modelo
// Gemini 2.0 Flash (más rápido): gemini-2.0-flash
// Gemini 2.5 Pro (más inteligente): gemini-2.5-pro-preview-0506
```

### Configurar Upstash Redis (opcional)

1. Crea una cuenta en [Upstash](https://upstash.com)
2. Crea un nuevo proyecto Redis
3. Copia `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`
4. Si no configuras Redis, el rate limiting se desactiva automáticamente

---

## Uso

### Chat Principal

Accede a [http://localhost:3000](http://localhost:3000)

El chat ofrece:
- **Menú rápido**: Botones para Mujer, Hombre, Niños, Ubicación, Envíos, Promos
- **Chat libre**: Escribe cualquier pregunta sobre la tienda
- **Imágenes de productos**: El bot puede mostrar imágenes usando `[IMAGEN:url]`

### Panel de Administración

Accede a [http://localhost:3000/admin](http://localhost:3000/admin)

**Credenciales por defecto:** `demo123`

#### Funciones del Admin

| Sección | Descripción |
|---------|-------------|
| Dashboard | Estadísticas: productos, consultas pendientes, stock bajo |
| Productos | CRUD completo, búsqueda, filtros por estado |
| Reservas | Reservas activas y vencidas |
| Ventas | Historial de ventas con estadísticas |
| Consultas | Ver conversaciones de clientes, exportar CSV |

---

## Base de Datos

### Esquema SQLite

El proyecto usa SQLite puro con `better-sqlite3` para máxima simplicidad y compatibilidad local.

```sql
-- Categorías (Mujer, Hombre, Niños)
CREATE TABLE Category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Productos
CREATE TABLE Product (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  categoryId TEXT NOT NULL,
  imageUrl TEXT,
  talles TEXT,
  estado TEXT DEFAULT 'disponible',
  reserva_info TEXT,
  venta_info TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Reservas
CREATE TABLE Reserva (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id TEXT NOT NULL,
  nombre_cliente TEXT NOT NULL,
  telefono_cliente TEXT,
  fecha_reserva DATETIME,
  fecha_vencimiento DATETIME,
  estado TEXT DEFAULT 'activa',
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Ventas
CREATE TABLE Venta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id TEXT NOT NULL,
  nombre_cliente TEXT,
  telefono_cliente TEXT,
  metodo_pago TEXT,
  precio_venta REAL,
  fecha_venta DATETIME,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Conversaciones
CREATE TABLE Conversation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mensajes TEXT,
  necesita_atencion BOOLEAN DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Estados de Producto

```
disponible → reservar → reservado → vender → vendido
                ↓                         ↓
             liberar                  liberar
                ↓                         ↓
           disponible ←←←←←←←←←←←←←←←←←←
```

| Estado | Descripción | Acciones |
|--------|-------------|----------|
| `disponible` | Listo para reservar o vender | Reservar, Vender |
| `reservado` | Apartado para un cliente | Vender, Liberar |
| `vendido` | Ya vendido | Liberar (para reventa) |

### Server Actions

Las operaciones del admin usan Server Actions en `actions.ts`:

| Función | Descripción |
|---------|-------------|
| `createProduct()` | Crea producto con imagen |
| `updateProduct()` | Actualiza producto |
| `deleteProduct()` | Elimina producto e imagen |
| `reservarProducto()` | Reserva un producto |
| `venderProducto()` | Registra venta |
| `liberarProducto()` | Libera a disponible |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Chat Page    │  │ Admin Panel │  │ Image Uploader   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                 │                                  │
│  ┌──────▼─────────────────▼───────┐                        │
│  │     Server Actions / API Routes │                        │
│  └──────────────┬─────────────────┘                        │
└─────────────────┼───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                        Backend                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ lib/db.ts    │  │ lib/redis.ts│  │ lib/models.ts     │  │
│  │ (SQLite)     │  │ (Rate Limit)│  │ (Data Models)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ lib/tienda-config.ts                                 │   │
│  │ • Productos, categorías, horarios                     │   │
│  │ • Sistema de prompts para Gemini                     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Flujo de una Consulta

```
1. Cliente escribe mensaje
         ↓
2. Frontend → POST /api/chat
         ↓
3. Rate Limiting (Redis)
         ↓
4. Generar prompt dinámico con productos de DB
         ↓
5. Enviar a Google Gemini
         ↓
6. Procesar respuesta (extraer imágenes)
         ↓
7. Guardar en SQLite
         ↓
8. Responder al cliente
```

---

## Testing

### Ejecutar Tests

```bash
# Modo interactivo (watch)
npm test

# Ejecución única
npm run test:run
```

### Cobertura de Tests

| Módulo | Tests | Descripción |
|--------|-------|-------------|
| tienda-config | 8 | Configuración, prompts |
| storage | 2 | localStorage utils |
| models | 2 | Modelos de datos |
| **Total** | **12** | ✅ Todos pasando |

---

## Desarrollo

### Estructura del Proyecto

```
ploshito-bot/
├── app/
│   ├── page.tsx              # Chat principal
│   ├── admin/                # Panel admin
│   │   ├── actions.ts        # Server Actions
│   │   ├── productos/       # Gestión productos
│   │   ├── reservas/        # Reservas
│   │   ├── ventas/          # Ventas
│   │   └── consultas/       # Consultas clientes
│   └── api/                  # API Routes
│       ├── chat/             # Chat con Gemini
│       └── admin/            # Endpoints admin
├── components/
│   ├── admin/               # Componentes admin
│   └── ui/                  # Componentes UI
├── lib/
│   ├── db.ts               # Cliente SQLite
│   ├── models.ts           # Modelos de datos
│   ├── redis.ts            # Rate limiting
│   ├── storage.ts          # localStorage
│   └── tienda-config.ts    # Config de tienda
├── tests/                   # Tests
├── public/
│   └── productos/          # Imágenes productos
└── seed.ts                  # Datos de ejemplo
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm start` | Servidor producción |
| `npm test` | Tests (watch) |
| `npm run test:run` | Tests una vez |
| `npm run seed` | Cargar productos ejemplo |

---

## Producción

### Opciones de Deploy

#### Vercel (Recomendado)

1. Subí el código a GitHub
2. Importá el proyecto en [Vercel](https://vercel.com)
3. Agregá las variables de entorno:
   - `GEMINI_API_KEY` (tu key de Google AI)
   - `UPSTASH_REDIS_REST_URL` (opcional)
   - `UPSTASH_REDIS_REST_TOKEN` (opcional)
   - `ADMIN_PASSWORD` (cambiá la contraseña por defecto)
4. Deploy automático en cada push

```bash
# CLI
npm i -g vercel
vercel login
vercel --prod
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Base de Datos en Producción

Por defecto usa SQLite local. Para escalar:

- **Vercel + Upstash Redis**: Para rate limiting
- **Supabase/Neon (PostgreSQL)**: Para DB en producción
- Adaptá `lib/db.ts` manteniendo la misma interfaz

### Seguridad en Producción

1. Cambiá `ADMIN_PASSWORD` por una contraseña segura
2. Considerá autenticación real (Supabase Auth, NextAuth)
3. Configurá SSL/HTTPS (Vercel lo provee automáticamente)

---

## Roadmap

### 🔵 Etapa 1: Local (Completada ✅)
- [x] Chat con IA funcionando
- [x] CRUD de productos
- [x] Sistema de reservas/ventas
- [x] Panel admin
- [x] 12 tests pasando
- [x] 30 productos de ejemplo con imágenes

### 🟢 Etapa 2: GitHub Portfolio (Lista)
- [x] Código limpio
- [x] README completo
- [x] Tests documentados
- [x] Agregar screenshots reales
- [ ] Crear repo público

### 🟡 Etapa 3: Producción (Pendiente)

#### Funcionalidades Requeridas
- [ ] Migrar a Supabase
- [ ] Auth real
- [ ] RLS configurado
- [ ] Rate limiting robusto

#### Funcionalidades Opcionales
- [ ] Integración WhatsApp Business API
- [ ] Sistema de pedidos/carrito
- [ ] Registro de clientes
- [ ] Notificaciones email
- [ ] Analytics

---

## API Reference

### Chat API

#### `POST /api/chat`

```json
// Request
{
  "message": "¿Qué productos tienen en mujer?",
  "history": [{"role": "user", "content": "Hola"}],
  "conversationId": 123
}

// Response
{
  "response": "Tenemos mucha variedad en mujer: jeans, remeras...",
  "conversationId": 123
}
```

#### `POST /api/chat/save`

```json
// Request
{
  "messages": [...],
  "conversationId": 123,
  "tipo": "reserva",
  "nombreCliente": "María",
  "producto": "Remera negra",
  "precio": 15000
}
```

### Admin APIs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/admin/products/[id]` | GET | Obtener producto |
| `/api/admin/products/[id]` | DELETE | Eliminar producto |
| `/api/admin/products/duplicate` | POST | Duplicar producto |
| `/api/admin/product-actions` | POST | Reservar/Vender/Liberar |

---

## Licencia

Este proyecto está bajo la licencia **MIT**.

---

## Créditos

Desarrollado con ❤️ usando Next.js, React, Tailwind CSS y Google Gemini.

### Contacto

- **GitHub**: [tu-usuario](https://github.com/tu-usuario)

---

<p align="center">
  <a href="#shopbot-">↑ Volver arriba</a>
</p>
