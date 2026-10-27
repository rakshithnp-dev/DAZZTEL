# HOTELYO - Release Notes

## Version 1.0.0-rc1 (Milestone G1 - Foundation & Core Architecture)
- Initialized production-grade monorepo structure with pnpm workspaces.
- Created comprehensive architecture specifications, requirements traceability matrix, and 25+ standard project documents in `/docs`.
- Designed normalized PostgreSQL 17 schema with Prisma ORM enforcing database-level anti-double-booking constraints via `BedNightAllocation(bedId, calendarDate)` composite unique index.
- Implemented environment configurations, Docker Compose orchestration, and local PostgreSQL database initialization.
- Laid out API contracts for `/api/v1` covering authentication, properties, availability search, booking holds, and payments.
