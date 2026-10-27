# HOTELYO - System Architecture Specification

## 1. Architectural Style: Modular Monolith
HOTELYO is architected as a production-grade **Modular Monolith** behind a single versioned REST API (`/api/v1`), serving the Guest Web Application, Staff Portal, Admin Dashboard, and future client applications.

```mermaid
flowchart TD
    subgraph Clients["Frontend Clients (PWA / Next.js)"]
        GUEST["Guest Web App (PWA)<br/>Port: 3000"]
        STAFF["Staff Portal (Responsive Web)<br/>Port: 3001"]
        ADMIN["Platform Admin Portal<br/>Port: 3002"]
    end

    subgraph API_Gateway["Unified API Gateway (/api/v1)"]
        AUTH_GUARD["JWT Auth & Role Guard"]
        TENANCY_GUARD["Property Scoping Guard"]
        RATE_LIMIT["Rate Limiter & Abuse Guard"]
        IDEMP_GUARD["Idempotency Interceptor"]
    end

    subgraph Backend_Modules["Core Modular Backend Services"]
        AUTH_MOD["Identity & RBAC Module"]
        PMS_CORE["PMS Single Source of Truth<br/>(Inventory, Bookings, Folios)"]
        BOOKING_ENGINE["Booking Engine & Holds"]
        PAYMENT_MOD["Payment & Reconciliation Adapter"]
        ARRIVAL_MOD["Arrival, Cryptographic OTP & Access Codes"]
        OPS_MOD["Housekeeping & Maintenance"]
        SAFETY_MOD["SOS & Escalation Engine"]
        MARKET_MOD["Marketplace (Food & Laundry)"]
        ENGAGE_MOD["FAQ & Loyalty Ledger"]
        ANALYTICS_MOD["Occupancy & Revenue Analytics"]
    end

    subgraph Async_Workers["Background Workers & Realtime"]
        BULLMQ["BullMQ Worker Engine"]
        HOLD_WORKER["Hold Expiry Worker (10m)"]
        MOTO_WORKER["Motorcycle Auto-Release Worker"]
        SOS_WORKER["SOS 2-Minute Escalation Worker"]
        SOCKET_IO["Socket.IO Live Staff Updates"]
    end

    subgraph Data_Layer["Persistent Data & Storage"]
        PG[(PostgreSQL 17 Database)]
        REDIS[(Redis 7 Cache & Queue)]
        S3[(Private S3 / Encrypted Storage)]
    end

    GUEST --> API_Gateway
    STAFF --> API_Gateway
    ADMIN --> API_Gateway
    STAFF <--> SOCKET_IO

    API_Gateway --> Backend_Modules
    Backend_Modules --> PG
    Backend_Modules --> REDIS
    Backend_Modules --> S3
    Backend_Modules --> BULLMQ
    BULLMQ --> HOLD_WORKER
    BULLMQ --> MOTO_WORKER
    BULLMQ --> SOS_WORKER
    PMS_CORE --> SOCKET_IO
```

## 2. Monorepo Organization
The codebase is structured as a clear monorepo using pnpm workspaces:

```text
HOTELYO/
├── apps/
│   ├── api/             # NestJS Modular Monolith REST API (/api/v1)
│   ├── guest-web/       # Next.js 14 App Router Guest PWA
│   ├── staff-web/       # Next.js 14 App Router Staff Operations Portal
│   ├── admin-web/       # Next.js 14 App Router Admin & Analytics Portal
│   └── worker/          # BullMQ Background Job Processors
├── packages/
│   ├── shared-types/    # TypeScript DTOs, Enums, API Interfaces
│   ├── validation/      # Zod validation schemas shared across FE & BE
│   ├── ui/              # Reusable Tailwind / shadcn/ui components
│   └── config/          # Shared ESLint, Prettier, TypeScript configurations
├── prisma/
│   ├── schema.prisma    # Authoritative normalized PostgreSQL schema
│   ├── migrations/      # Version-controlled SQL migrations
│   └── seed.ts          # Deterministic, safe synthetic seed data
├── docs/                # Architecture, API guides, ADRs, and runbooks
├── docker-compose.yml   # Multi-service local and staging orchestration
└── .env.example         # Documented environment configuration
```

## 3. Technology Stack Justification
- **Backend (NestJS + TypeScript):** Enterprise-grade modular architecture with strict dependency injection, built-in validation pipes, OpenAPI documentation generation, and guards for property scoping and RBAC.
- **Frontend (Next.js App Router + React + Tailwind + TanStack Query):** High-performance server/client component model, responsive mobile-first UI for hostel travelers, and PWA service-worker offline caching.
- **Database (PostgreSQL 17 + Prisma ORM):** ACID transactional guarantees, composite unique indexes for strict anti-double-booking invariant enforcement, and point-in-time recovery capabilities.
- **Queue & Realtime (BullMQ + Redis + Socket.IO):** High-throughput, distributed job scheduling for hold expirations, auto-release jobs, and sub-5-second SOS alert propagation.
