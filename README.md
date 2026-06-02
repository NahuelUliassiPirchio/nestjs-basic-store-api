# Basic Store API

> RESTful API for an e-commerce platform with product bidding, built with NestJS and deployed on Azure.

## 📖 About

Basic Store is the backend of my first public web application — an e-commerce platform that lets users browse products, place orders, and bid on items. The API is built with NestJS following a modular architecture, with JWT-based authentication, Redis caching, and full Swagger documentation. It was developed to put acquired backend knowledge into a real, deployed product.

## ✨ Features

- Product catalog with categories and brands
- Order management with order items
- Product bidding system (place and track bids)
- JWT authentication and role-based authorization
- Redis caching for brands, categories, and products
- Rate limiting, CORS, and security headers via Helmet
- Swagger UI for interactive API documentation and testing
- Database seeding scripts for local development

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js 24.x |
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | TypeORM |
| Auth | Passport.js + JWT |
| Caching | Redis (`@keyv/redis`) + cache-manager |
| Validation | class-validator + class-transformer |
| Security | Helmet, @nestjs/throttler |
| Documentation | Swagger (@nestjs/swagger) |
| Testing | Jest + Supertest |
| Deployment | Azure App Service + PM2 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL running locally
- Redis running locally (optional — falls back to in-memory cache)

### Installation

```bash
git clone https://github.com/NahuelUliassiPirchio/nestjs-basic-store-api.git
cd nestjs-basic-store-api
npm install
```

Copy the example environment file and fill in your values:
```bash
cp .env.example .env
```

---

## ⚙️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_HOST` | PostgreSQL host | ✅ |
| `DATABASE_USER` | PostgreSQL user | ✅ |
| `DATABASE_PORT` | PostgreSQL port | ✅ |
| `DATABASE_PASSWORD` | PostgreSQL password | ✅ |
| `DATABASE_NAME` | Database name | ✅ |
| `DATABASE_URI` | Full PostgreSQL connection URI | ✅ |
| `TYPEORM_CONNECTION` | TypeORM driver (`postgres`) | ✅ |
| `TYPEORM_HOST` | TypeORM host | ✅ |
| `TYPEORM_USERNAME` | TypeORM username | ✅ |
| `TYPEORM_PASSWORD` | TypeORM password | ✅ |
| `TYPEORM_DATABASE` | TypeORM database name | ✅ |
| `TYPEORM_PORT` | TypeORM port | ✅ |
| `TYPEORM_SYNCHRONIZE` | Auto-sync schema (disable in prod) | No |
| `TYPEORM_LOGGING` | Enable query logging | No |
| `TYPEORM_ENTITIES` | Entity glob pattern | ✅ |
| `TYPEORM_MIGRATIONS` | Migrations glob pattern | ✅ |
| `TYPEORM_MIGRATIONS_DIR` | Migrations output directory | ✅ |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ |
| `JWT_EXPIRES_IN_TIME` | Token expiry duration (e.g. `30s`) | ✅ |
| `REDIS_URL` | Redis connection URL | No (default: in-memory) |

---

## 📁 Project Structure

```
src/
├── auth/               # JWT strategy, guards, decorators, login controller
├── products/
│   ├── controllers/    # Products, brands, categories endpoints
│   ├── entities/       # Product, Brand, Category, Bid, BidItem
│   └── services/       # Business logic per resource
├── users/
│   ├── controllers/    # User CRUD endpoints
│   ├── entities/       # User, Order, OrderItem
│   └── services/       # User and order business logic
├── common/             # Shared enums and encryption utilities
├── database/           # TypeORM data source, migrations, seed scripts
├── config.ts           # Environment config loader
└── main.ts             # App bootstrap with Swagger setup
```

---

## 🖥 Usage

**Development**
```bash
npm run dev
```

**Production build**
```bash
npm run build
npm run start:prod
```

**Run tests**
```bash
npm run test
```

**Seed the database**
```bash
npm run seed
```

**Generate a migration**
```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

---

## 🌐 Live Demo

- **Frontend:** [nextjs-basic-store-frontend.vercel.app](https://nextjs-basic-store-frontend.vercel.app/)
- **API Docs:** [Swagger UI](https://bsc-store-f4gyb8eqh4cvc9fb.brazilsouth-01.azurewebsites.net/basic-store/docs)
- **Portfolio:** [uliassipirchio.com/en/projects/basic-store](https://www.uliassipirchio.com/en/projects/basic-store)

---

## 👤 Author

**Nahuel Uliassi Pirchio**

- 🌐 [uliassipirchio.com](https://uliassipirchio.com)
- 💼 [LinkedIn](https://linkedin.com/in/uliassipirchio)
- 🐙 [GitHub](https://github.com/NahuelUliassiPirchio)
