# Contributing to ShopBot

Thank you for your interest in contributing to ShopBot! This document provides guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and inclusive in communications
- Accept constructive criticism professionally
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before reporting a bug, please check if the issue has already been reported. When filing a bug report, include:

1. **Title**: Clear and descriptive title
2. **Description**: Detailed description of the issue
3. **Steps to Reproduce**: Numbered list of steps
4. **Expected vs Actual Behavior**: What you expected vs what happened
5. **Environment**: OS, Node.js version, browser (if applicable)
6. **Screenshots**: If applicable

### Suggesting Features

We welcome feature suggestions! Please include:

1. **Feature Description**: Clear description of the feature
2. **Use Case**: Why this feature would be useful
3. **Alternatives Considered**: Other solutions you considered
4. **Implementation Notes**: Any ideas on how to implement it

### Pull Requests

#### Pull Request Process

1. **Fork** the repository
2. **Clone** your fork locally: `git clone https://github.com/YOUR_USERNAME/botShop-AI.git`
3. **Create** a feature branch: `git checkout -b feature/my-new-feature`
4. **Make** your changes following our coding standards
5. **Add** tests for new functionality
6. **Run** tests to ensure everything passes: `npm test`
7. **Commit** your changes with clear commit messages
8. **Push** to your fork: `git push origin feature/my-new-feature`
9. **Submit** a Pull Request

#### Pull Request Guidelines

- PRs should be focused and atomic (one feature/fix per PR)
- Include a clear description of the changes
- Link related issues
- Ensure all tests pass before submitting
- Update documentation if needed
- Follow the existing code style

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/botShop-AI.git
cd botShop-AI

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run seed` | Load sample data |

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Prefer explicit types over `any`
- Use interfaces over types for object shapes
- Export types that are used across modules

### React/Next.js

- Use functional components with hooks
- Follow Next.js conventions for App Router
- Use Server Components when possible
- Keep components small and focused

### Testing

- Write tests for all new functionality
- Aim for meaningful test coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Git Commits

Follow [Conventional Commits](https://wwwconventionalcommits.org):

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes (formatting)
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

Examples:
- `feat: add WhatsApp integration`
- `fix: resolve rate limiting issue`
- `docs: update API documentation`

## Project Structure

```
botShop-AI/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── chat/         # Chat API endpoints
│   │   └── admin/        # Admin API endpoints
│   └── admin/            # Admin pages
├── src/
│   ├── components/       # React components
│   │   ├── admin/       # Admin components
│   │   └── ui/          # UI components
│   └── lib/             # Core libraries
│       ├── db.ts        # Database (SQLite)
│       ├── models.ts    # Data models
│       ├── redis.ts    # Rate limiting
│       ├── storage.ts  # Storage utilities
│       └── tienda-config.ts  # Store configuration
├── tests/                # Test files
├── public/               # Static assets
└── seed.ts               # Sample data loader
```

## API Documentation

### Chat API

```typescript
// POST /api/chat
interface ChatRequest {
  message: string;
  history?: Message[];
  conversationId?: number;
}

interface ChatResponse {
  response: string;
  conversationId: number;
}
```

### Admin API

All admin endpoints require authentication via cookie.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/products` | GET | List products |
| `/api/admin/products/[id]` | GET/DELETE | Product operations |
| `/api/admin/reservas` | GET/POST | Manage reservations |
| `/api/admin/ventas` | GET/POST | Manage sales |
| `/api/admin/conversaciones` | GET | View conversations |

## Questions?

If you have questions, feel free to open an issue with the `question` label.

## Recognition

Contributors will be recognized in the README.md file.

---

Thank you for contributing to ShopBot!
