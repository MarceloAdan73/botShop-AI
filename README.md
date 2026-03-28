# 🧠 ShopBot AI

<div align="center">

<!-- Banner Principal -->
<img src="https://capsule-render.vercel.app/api?type=wave&color=0:00d4ff,100:7b2cbf&height=300&section=header&text=ShopBot%20AI&fontSize=90&fontAlignY=30&animation=fadeIn&desc=AI-Powered%20E-commerce%20Bot&descAlignY=70&descSize=30" width="100%" />

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge" alt="Vitest">
</p>

<!-- Stats -->
<p>
  <img src="https://img.shields.io/github/stars/MarceloAdan73/botShop-AI?style=social" alt="stars">
  <img src="https://img.shields.io/github/forks/MarceloAdan73/botShop-AI?style=social" alt="forks">
  <img src="https://img.shields.io/github/license/MarceloAdan73/botShop-AI" alt="license">
  <img src="https://img.shields.io/badge/tests-12%20passing-42b883" alt="tests">
</p>

> **🧠 AI Chatbot** · **📦 E-commerce** · **💰 Reservas & Ventas** · **🛡️ Admin Panel**

Un asistente de inteligencia artificial para tiendas de indumentaria, potenciado por **Google Gemini 2.5 Flash**, con gestión completa de productos, reservas y ventas.

</div>

---

## ✨ Características

| Característica | Descripción |
|----------------|-------------|
| 🧠 **Chatbot IA** | Asistente virtual inteligente powered by Google Gemini 2.5 Flash con contexto completo del inventario |
| 📦 **Gestión de Productos** | CRUD completo con imágenes, categorías, talles y control de stock |
| 💰 **Sistema de Reservas** | Reserva de productos con fecha de vencimiento, seguimiento de estado |
| 📊 **Control de Ventas** | Registro de ventas, métodos de pago, estadísticas por período |
| 💬 **Consultas de Clientes** | Logging automático de conversaciones, marca como atendidas, exportación CSV |
| 🛡️ **Seguridad** | Autenticación por cookies, rate limiting (Upstash Redis), validación de entradas |
| 📱 **Diseño Responsive** | Interfaz adaptada para móvil y escritorio |
| ✅ **Calidad** | 12 tests pasando, TypeScript strict, build optimizado |

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18.x o superior
- npm 9.x o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MarceloAdan73/botShop-AI.git
cd botShop-AI

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tu GEMINI_API_KEY
```

### Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000)

### Datos de Prueba

```bash
# Cargar 30 productos de ejemplo (mujer, hombre, niños)
npm run seed
```

---

## ⚙️ Configuración

### Variables de Entorno

```env
# Google Gemini API (requerido)
# ⚠️ La key de ejemplo es de PRUEBA con límites muy bajos
# Obtén tu propia key gratuita o de pago en: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Upstash Redis (opcional, para rate limiting)
# Crea una cuenta en: https://upstash.com
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Admin Panel (contraseña para acceder al panel)
ADMIN_PASSWORD=demo123

# Database (opcional, por defecto usa SQLite local)
DATABASE_URL=file:./dev.db
```

### 🤖 Modelos de IA Disponibles

> ⚠️ **Nota:** La API key de Google Gemini en `.env.example` es de **prueba/gratuita** con límites muy bajos. Para uso en producción real, obten tu propia API key en [Google AI Studio](https://aistudio.google.com/app/apikey).

| Modelo | Velocidad | Inteligencia | API Key |
|--------|-----------|--------------|---------|
| Gemini 2.0 Flash | ⚡⚡⚡ | ⭐⭐ | Gratuita |
| **Gemini 2.5 Flash** | ⚡⚡ | ⭐⭐⭐ (actual) | Gratuita (límites bajos) |
| Gemini 2.5 Pro | ⚡ | ⭐⭐⭐⭐ | Requiere API key de pago |

**Para cambiar el modelo:** Edita `src/app/api/chat/route.ts` línea 72:

```typescript
// Cambia esta línea:
gemini-2.5-flash

// Por ejemplo para 2.0 Flash (más rápido):
gemini-2.0-flash

// O para 2.5 Pro (más inteligente):
gemini-2.5-pro-preview-0606
```

**Obtener API key de producción:**
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Actualiza `GEMINI_API_KEY` en tus variables de entorno

---

## 📁 Estructura del Proyecto

```
botShop-AI/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Chat UI principal
│   │   ├── layout.tsx            # Layout raíz
│   │   ├── admin/                # Páginas del panel admin
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── productos/        # Gestión de productos
│   │   │   ├── reservas/          # Gestión de reservas
│   │   │   ├── ventas/           # Gestión de ventas
│   │   │   └── consultas/        # Consultas de clientes
│   │   └── api/                  # Rutas API
│   │       ├── chat/             # API del chatbot IA
│   │       └── admin/            # API del panel admin
│   ├── components/
│   │   ├── admin/                # Componentes del admin
│   │   └── ui/                   # Componentes UI
│   └── lib/
│       ├── db.ts                 # Cliente SQLite
│       ├── models.ts             # Modelos de datos
│       ├── redis.ts              # Rate limiting
│       ├── storage.ts           # Storage utilities
│       └── tienda-config.ts      # Configuración de la tienda
├── tests/                        # Tests Vitest
├── public/                       # Assets estáticos
├── seed.ts                       # Datos de ejemplo
└── package.json
```

---

## 🏗️ Arquitectura y Decisiones Técnicas

### Stack Elegido

| Tecnología | Decisión |
|------------|----------|
| **Next.js 16** | App Router, Server Actions, React 19 |
| **SQLite (dev)** | Simplicidad, zero-config, ideal para prototyping |
| **Google Gemini 2.5 Flash** | Mejor costo/rendimiento para chatbots comerciales |
| **Tailwind CSS 4** | Styling rápido, dark mode built-in |
| **Vitest** | Testing rápido, compatible con Jest |
| **Upstash Redis** | Rate limiting serverless-friendly |

### Patrones de Diseño

- **Server Actions** - mutations sin API routes intermedias
- **Model-View-Controller** - modelos en `/lib/models.ts`
- **ORM-like con better-sqlite3** - queries tipadas y reutilizables
- **Fail-open** - servicios opcionales (Redis) no rompen la app

### Por qué SQLite para desarrollo?

- Zero setup: `npm install` y funciona
- Portabilidad: un archivo `dev.db` con todo
- Suficiente para MVP y demos
- Migración a PostgreSQL transparente

---

## 🔌 API Endpoints

### Chat (Público)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/chat` | Enviar mensaje al chatbot IA |
| `POST` | `/api/chat/save` | Guardar conversación/reserva |

### Admin (Autenticado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/products` | Listar productos |
| `POST` | `/api/admin/products` | Crear producto |
| `GET` | `/api/admin/products/[id]` | Ver producto |
| `PUT` | `/api/admin/products/[id]` | Actualizar producto |
| `DELETE` | `/api/admin/products/[id]` | Eliminar producto |
| `POST` | `/api/admin/products/duplicate` | Duplicar producto |
| `GET` | `/api/admin/products-stats` | Estadísticas de productos |
| `GET` | `/api/admin/reservas` | Listar reservas |
| `POST` | `/api/admin/reservas` | Crear reserva |
| `PUT` | `/api/admin/reservas/[id]` | Actualizar reserva |
| `GET` | `/api/admin/ventas` | Listar ventas |
| `POST` | `/api/admin/ventas` | Registrar venta |
| `GET` | `/api/admin/conversaciones` | Listar conversaciones |
| `GET` | `/api/admin/conversaciones/[id]` | Ver conversación |
| `POST` | `/api/admin/clean-images` | Limpiar imágenes huérfanas |

---

## 🗄️ Schema de Base de Datos

```sql
-- Categorías de productos
CREATE TABLE Category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  icon TEXT,
  talles TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE Product (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  categoryId TEXT REFERENCES Category(id),
  imageUrl TEXT,
  talles TEXT,
  estado TEXT DEFAULT 'disponible', -- disponible/reservado/vendido
  reserva_info TEXT,  -- JSON
  venta_info TEXT,   -- JSON
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reservas de clientes
CREATE TABLE Reserva (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id TEXT REFERENCES Product(id),
  nombre_cliente TEXT NOT NULL,
  telefono_cliente TEXT,
  fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_vencimiento DATETIME,
  estado TEXT DEFAULT 'activa', -- activa/completada/cancelada/vencida
  nota TEXT
);

-- Ventas registradas
CREATE TABLE Venta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id TEXT REFERENCES Product(id),
  nombre_cliente TEXT,
  telefono_cliente TEXT,
  metodo_pago TEXT,
  precio_venta REAL,
  nota TEXT,
  fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Conversaciones del chatbot
CREATE TABLE Conversation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_cliente TEXT,
  telefono_cliente TEXT,
  fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_mensajes INTEGER DEFAULT 0,
  necesita_atencion BOOLEAN DEFAULT 0,
  resumen TEXT,
  mensajes TEXT, -- JSON array
  userInfo TEXT  -- JSON
);

-- Configuración de la tienda
CREATE TABLE Config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  storeInfo TEXT NOT NULL  -- JSON
);
```

### Relaciones

```
Category 1──∞ Product
Product 1──∞ Reserva
Product 1──∞ Venta
Conversation 1──∞ (embedded in mensajes JSON)
```

---

## 🗺️ Roadmap

### ✅ Completado (v0.1.0)

- [x] Chatbot IA con Gemini
- [x] CRUD de productos
- [x] Sistema de reservas
- [x] Registro de ventas
- [x] Panel de administración
- [x] Rate limiting opcional
- [x] Tests unitarios

### 🔄 En Progreso

- [ ] Migración a PostgreSQL/Supabase
- [ ] Dashboard con gráficos
- [ ] Notificaciones en tiempo real

### 📋 Planeado (v1.0.0)

- [ ] Autenticación con NextAuth
- [ ] Multi-tienda (SaaS)
- [ ] Panel de estadísticas avanzadas
- [ ] WhatsApp Business integration
- [ ] Pagos con Mercado Pago
- [ ] App móvil (React Native/Expo)
- [ ] Cacheo de respuestas IA
- [ ] Tests de integración E2E

### 🐛 Known Issues

- SQLite no escala >1000 productos concurrentes
- Rate limiting requiere Redis para producción
- Las imágenes se almacenan como URLs externas

---

## 🧪 Testing

```bash
# Ejecutar tests en watch mode
npm test

# Ejecutar tests una vez
npm run test:run

# Cargar datos de ejemplo
npm run seed
```

---

## 🐳 Despliegue

### Vercel (Recomendado)

```bash
# Importar en Vercel
# https://vercel.com/new/clone?repository-url=https://github.com/MarceloAdan73/botShop-AI

# O desde CLI
npm i -g vercel
vercel --prod
```

### Docker

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

```bash
docker build -t botshop-ai .
docker run -p 3000:3000 botshop-ai
```

---

## 📸 Capturas de Pantalla

### Interfaz de Chat

| Desktop | Móvil |
|---------|-------|
| ![Bot](public/screenshots/bot.png) | ![Mobile](public/screenshots/mobile.png) |

### Panel de Administración

| Dashboard | Productos |
|------------|-----------|
| ![Dashboard](public/screenshots/panel.png) | ![Products](public/screenshots/panel2.png) |

---

## ☁️ Guía de Producción (Supabase + Vercel)

### Por qué migrar a PostgreSQL?

| Aspecto | SQLite | PostgreSQL (Supabase) |
|---------|--------|----------------------|
| Concurrencia | Limitada | Alta |
| Despliegue | Local/file | Cloud managed |
| Escalabilidad | Horizontal limitada | Escalable |
| Backup | Manual | Automático |
| Perfecto para | Dev/Demo | Producción |

### Paso 1: Crear Base de Datos (Supabase)

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings → Database → Connection String**
4. Copia el connection string ( formato: `postgres://user:pass@host:5432/dbname` )

### Paso 2: Configurar Variables de Entorno

```env
# Base de datos PostgreSQL (Supabase)
DATABASE_URL=postgres://[user]:[password]@[host]:5432/[dbname]

# Redis para rate limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://[your-db].upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-token]

# Seguridad
ADMIN_PASSWORD=tu_password_seguro
GEMINI_API_KEY=tu_api_key

# Producción
NODE_ENV=production
```

### Paso 3: Actualizar el Código para PostgreSQL

Instala el driver de PostgreSQL:

```bash
npm install pg
```

Modifica `src/lib/db.ts` para usar PostgreSQL en producción:

```typescript
import Database from 'better-sqlite3';
import pg from 'pg';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.DATABASE_URL?.startsWith('postgres');

let db: any;

if (isProduction) {
  // PostgreSQL (Supabase/Neon)
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = {
    prepare: (sql: string) => ({
      all: (...params: any[]) => pool.query(sql, params).then(res => res.rows),
      get: (...params: any[]) => pool.query(sql, params).then(res => res.rows[0]),
      run: (...params: any[]) => pool.query(sql, params).then(res => ({ 
        changes: res.rowCount, 
        lastInsertRowid: res.rows[0]?.id 
      }))
    })
  };
} else {
  // SQLite (desarrollo local)
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.resolve(process.cwd(), 'dev.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
}

export default db;
```

### Paso 4: Desplegar en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

O conecta directamente tu repositorio en [vercel.com](https://vercel.com):

1. Importa el repositorio
2. Configura las variables de entorno en Settings
3. Deploy automático en cada push

### Paso 5: Configurar Rate Limiting

Usa **Upstash Redis** para proteger tu API:

1. Crea cuenta en [upstash.com](https://upstash.com)
2. Crea una base de datos Redis
3. Copia `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`
4. Agrega las variables en Vercel

### Checklist de Producción

- [ ] Cambiar `ADMIN_PASSWORD` por uno seguro
- [ ] Configurar `GEMINI_API_KEY` de producción
- [ ] Conectar PostgreSQL (Supabase/Neon)
- [ ] Configurar Upstash Redis
- [ ] Habilitar SSL/HTTPS (Vercel lo hace automático)
- [ ] Configurar backups en Supabase
- [ ] Monitorear uso de API keys

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) para más detalles.

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE)

---

## 👤 Autor

**Marcelo Adan**

[![GitHub](https://img.shields.io/badge/GitHub-M%20MarceloAdan73-181717?style=flat-square)](https://github.com/MarceloAdan73)

---

<div align="center">
  <a href="#-botshop-ai">⬆️ Volver arriba</a>
</div>
