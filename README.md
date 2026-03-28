# 🧠 ShopBot AI

<div align="center">

[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://gemini.google.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge)](https://vitest.dev)
[![Tests](https://img.shields.io/badge/tests-12%20passing-42b883?style=for-the-badge)](https://vitest.dev)
[![License](https://img.shields.io/github/license/MarceloAdan73/botShop-AI?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/MarceloAdan73/botShop-AI?style=for-the-badge)](https://github.com/MarceloAdan73/botShop-AI/stargazers)

> 🤖 **AI Chatbot** · 📦 **E-commerce** · 💰 **Reservas & Ventas** · 🛡️ **Admin Panel**

Asistente de inteligencia artificial para tiendas de indumentaria, potenciado por **Google Gemini 2.5 Flash**, con gestión completa de productos, reservas y ventas.

</div>

---

## ✨ Características

| Característica | Descripción |
|----------------|-------------|
| 🧠 **Chatbot IA** | Asistente virtual inteligente powered by Google Gemini 2.5 Flash con contexto completo del inventario |
| 📦 **Gestión de Productos** | CRUD completo con imágenes, categorías, talles y control de stock |
| 💰 **Sistema de Reservas** | Reserva de productos con fecha de vencimiento, seguimiento de estado |
| 📊 **Control de Ventas** | Registro de ventas, métodos de pago, estadísticas por período |
| 💬 **Consultas de Clientes** | Logging automático de conversaciones, marca como atendidas |
| 🛡️ **Seguridad** | Autenticación por cookies, rate limiting (Upstash Redis) |
| 📱 **Diseño Responsive** | Interfaz adaptada para móvil y escritorio |
| ✅ **Calidad** | 12 tests pasando, TypeScript strict |

---

## 📸 Capturas de Pantalla

### Chat - Interfaz con el Bot

| Desktop | Móvil |
|---------|-------|
| ![Bot](public/screenshots/bot.png) | ![Mobile](public/screenshots/mobile.png) |

### Panel de Administración

| Dashboard | Productos |
|------------|-----------|
| ![Dashboard](public/screenshots/panel.png) | ![Products](public/screenshots/panel2.png) |

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18.x o superior

### Instalación

```bash
git clone https://github.com/MarceloAdan73/botShop-AI.git
cd botShop-AI
npm install
cp .env.example .env.local
```

### Ejecutar

```bash
npm run dev
npm run seed    # Cargar 30 productos de ejemplo
```

Abre [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuración

### Variables de Entorno

```env
# Google Gemini API (requerido)
# ⚠️ La key de ejemplo es de PRUEBA con límites muy bajos
# Obtén tu key en: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# Rate limiting (opcional)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Admin
ADMIN_PASSWORD=demo123
```

### 🤖 Modelos de IA

> ⚠️ La API key gratuita tiene límites muy bajos. Para producción, obten tu propia key.

| Modelo | Velocidad | Inteligencia |
|--------|-----------|--------------|
| Gemini 2.0 Flash | ⚡⚡⚡ | ⭐⭐ |
| **Gemini 2.5 Flash** | ⚡⚡ | ⭐⭐⭐ (actual) |
| Gemini 2.5 Pro | ⚡ | ⭐⭐⭐⭐ |

Cambia el modelo en `src/app/api/chat/route.ts` línea 72.

---

## 📁 Estructura del Proyecto

```
botShop-AI/
├── src/app/
│   ├── page.tsx              # Chat UI
│   ├── admin/                # Panel admin
│   │   ├── productos/        # CRUD productos
│   │   ├── reservas/         # Reservas
│   │   ├── ventas/           # Ventas
│   │   └── consultas/       # Conversaciones
│   └── api/                  # Rutas API
├── src/lib/
│   ├── db.ts                 # SQLite
│   ├── models.ts             # Modelos
│   ├── redis.ts              # Rate limiting
│   └── tienda-config.ts      # Config tienda
├── tests/                    # Vitest
├── seed.ts                   # Datos ejemplo
└── package.json
```

---

## 🏗️ Arquitectura

### Tech Stack

| Categoría | Tecnología | Propósito |
|-----------|------------|----------|
| **Framework** | Next.js 16 | App Router, Server Actions |
| **UI** | React 19 | Componentes |
| **Lenguaje** | TypeScript | Tipado estático |
| **Estilos** | Tailwind CSS 4 | CSS utility-first |
| **Iconos** | Lucide React | Iconos |
| **Notificaciones** | React Hot Toast | Toasts |
| **Base de Datos** | better-sqlite3 | SQLite ORM |
| **IA** | Google Gemini SDK | Chatbot IA |
| **Rate Limiting** | Upstash Redis | Protección API |
| **Testing** | Vitest | Tests unitarios |
| **PostgreSQL** | pg (listo) | Migración a producción |
| **Ejecutor** | tsx | Run scripts TypeScript |

### Patrones de Diseño
- **Server Actions** - mutations sin API routes intermedias
- **MVC** - modelos tipados en `/lib/models.ts`
- **Fail-open** - servicios opcionales (Redis) no rompen la app
- **WAL Mode** - SQLite con write-ahead logging para mejor performance

---

## 🔌 API Endpoints

### Chat (Público)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/chat` | Mensaje al chatbot |
| `POST` | `/api/chat/save` | Guardar conversación |

### Admin (Autenticado)
| Método | Endpoint |
|--------|----------|
| `GET/POST` | `/api/admin/products` |
| `GET/PUT/DELETE` | `/api/admin/products/[id]` |
| `GET/POST` | `/api/admin/reservas` |
| `GET/POST` | `/api/admin/ventas` |
| `GET` | `/api/admin/conversaciones` |

---

## 🗄️ Schema de Base de Datos

```sql
Category (id, name, slug, icon, talles)
Product (id, name, price, stock, categoryId, imageUrl, talles, estado)
Reserva (id, producto_id, nombre_cliente, fecha_reserva, estado)
Venta (id, producto_id, nombre_cliente, metodo_pago, precio_venta)
Conversation (id, mensajes JSON, necesita_atencion)
Config (id, storeInfo JSON)
```

---

## 🧪 Testing

```bash
npm test        # Watch mode
npm run test:run
```

---

## 🐳 Despliegue

### Vercel
```bash
vercel --prod
```

### Docker
```bash
docker build -t botshop-ai .
docker run -p 3000:3000 botshop-ai
```

---

## 🗺️ Roadmap

### ✅ Completado
- [x] Chatbot IA con Gemini
- [x] CRUD productos
- [x] Reservas y ventas
- [x] Panel admin
- [x] Rate limiting

### 📋 Planeado
- [ ] PostgreSQL/Supabase
- [ ] Dashboard con gráficos
- [ ] WhatsApp integration
- [ ] Mercado Pago
- [ ] Multi-tienda (SaaS)

---

## ☁️ Producción

Ver guía completa en el repositorio para migrar a **Supabase + Vercel**:

1. Crear proyecto Supabase
2. Configurar variables de entorno
3. Actualizar `db.ts` para PostgreSQL
4. Desplegar en Vercel

---

## 📄 Licencia

MIT - ver [LICENSE](LICENSE)

---

## 👤 Autor

**Marcelo Adan**  
[![GitHub](https://img.shields.io/badge/GitHub-M%20MarceloAdan73-181717?style=flat-square)](https://github.com/MarceloAdan73)

---

<div align="center">
  <a href="#-botshop-ai">⬆️ Volver arriba</a>
</div>
