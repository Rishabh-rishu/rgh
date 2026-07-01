hiii
# RGH Platform Backend

Node.js microservices platform for property and community management. **All client requests go through the API Gateway** — services are not exposed directly to clients.

## Architecture

```
Client
  │
  ▼
API Gateway (3000)
  │
  ├── Auth Service          (3001) ──┐
  ├── Property Service      (3002) ──┤
  ├── Operations Service    (3003) ──├── PostgreSQL (rgh_db)
  ├── Booking Service       (3004) ──┤
  ├── Community Service     (3005) ──┤
  └── Notification Service  (3006) ──┘
```

## Project Structure

```
rgh-backend/
├── packages/shared/          # Shared middleware, utilities
├── services/
│   ├── api-gateway/          # Single entry point (port 3000)
│   ├── auth-service/         # Authentication & authorization
│   ├── property-service/     # Properties, tenants, amenities
│   ├── operations-service/   # Guards, providers, incidents
│   ├── booking-service/      # Bookings, guests, wallet, payments
│   ├── community-service/    # Posts, comments, likes
│   └── notification-service/ # Email, SMS, push notifications
├── docker-compose.yml        # Optional local PostgreSQL (dev only)
└── .env.example
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env` with your PostgreSQL credentials:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/rgh_db
```

### 3. Initialize database

```bash
npm run db:generate
npm run db:push
npm run db:seed -w @rgh/auth-service
```

### 4. Start all services

```bash
npm run dev
```

## API Gateway Routes

All requests use base URL: `http://localhost:3000`

| Gateway Path | Target Service | Auth Required |
|-------------|----------------|---------------|
| `/api/auth/*` | Auth (3001) | Public (login, OTP) / JWT |
| `/api/properties/*` | Property (3002) | JWT |
| `/api/operations/*` | Operations (3003) | JWT |
| `/api/bookings/*` | Booking (3004) | JWT |
| `/api/community/*` | Community (3005) | JWT |
| `/api/notifications/*` | Notification (3006) | JWT (OTP endpoint public) |

### Login Example

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rgh.com","password":"Admin@123"}'
```

## Default Admin User

| Field | Value |
|-------|-------|
| Email | admin@rgh.com |
| Password | Admin@123 |

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL + Sequelize ORM
- **API Gateway:** http-proxy-middleware
- **Auth:** JWT + Refresh Tokens
