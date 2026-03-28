<div align="center">

<h1>🤖 ShopBot</h1>

<h3>AI Assistant for Clothing Stores</h3>

<p>
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge" alt="Vitest">
</p>

**🤖 AI Chatbot • 📦 Products • 💰 Reservations & Sales • 🛡️ Admin Panel**

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chatbot** | Google Gemini 2.5 Flash powered, responds to product queries, sizes, prices, shipping |
| 📦 **Product CRUD** | Full product management with images, categories (Women/Men/Kids), sizes & stock |
| 💰 **Reservations** | Reserve products with expiry dates, track sales history |
| 💬 **Client Inquiries** | Automatic conversation logging, mark as handled, export to CSV |
| 🛡️ **Security** | Cookie-based auth, rate limiting (Upstash Redis), input validation |
| ✅ **Quality** | 12 passing tests, TypeScript strict, optimized build |

---

## 📸 Screenshots

### Chat Interface
![Bot](screenshots/bot.png)
![Mobile](screenshots/mobile.png)

### Admin Panel
![Dashboard](screenshots/panel.png)
![Products](screenshots/panel2.png)

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/MarceloAdan73/botShop-AI.git
cd botShop-AI

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your GEMINI_API_KEY

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key    # Required - get at aistudio.google.com
UPSTASH_REDIS_REST_URL=                # Optional - for rate limiting
UPSTASH_REDIS_REST_TOKEN=             # Optional
ADMIN_PASSWORD=demo123                 # Change in production
```

### Upgrade AI Model

| Model | Speed | Intelligence |
|-------|-------|--------------|
| Gemini 2.0 Flash | ⚡⚡⚡ | ⭐⭐ |
| Gemini 2.5 Flash | ⚡⚡ | ⭐⭐⭐ (current) |
| Gemini 2.5 Pro | ⚡ | ⭐⭐⭐⭐ |

Edit `src/app/api/chat/route.ts` to change model.

---

## 📁 Project Structure

```
botShop-AI/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Chat UI
│   │   ├── admin/             # Admin pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   └── lib/                   # Core logic
│       ├── db.ts              # SQLite client
│       ├── models.ts          # Data models
│       └── tienda-config.ts   # Store config
├── tests/                     # Vitest tests
├── public/screenshots/        # Screenshots
└── seed.ts                    # Sample data
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm test` | Run tests (watch) |
| `npm run test:run` | Run tests once |
| `npm run seed` | Load 30 sample products |

---

## �部署 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
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

---

## 🔒 Production Notes

- Change `ADMIN_PASSWORD` before deploying
- Consider using PostgreSQL (Supabase/Neon) instead of SQLite for scale
- Use Upstash Redis for rate limiting in production
- Get a paid API key for higher request limits

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## 👤 Author

Marcelo Adan

[![GitHub](https://img.shields.io/badge/GitHub-M MarceloAdan73-181717?style=flat-square)](https://github.com/MarceloAdan73)

---

<div align="center">
<a href="#-shopbot">⬆️ Back to top</a>
</div>
