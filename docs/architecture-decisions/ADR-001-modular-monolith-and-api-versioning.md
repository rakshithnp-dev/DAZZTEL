# ADR-001: Modular Monolith and API Versioning Strategy

## Status
Accepted

## Context
HOTELYO is a multi-property hospitality platform with interdependent domains: bookings, inventory, folios, check-in, operations, safety, and marketplace. Microservices would introduce premature network overhead, distributed transaction complexity (e.g. 2PC/Saga across bookings and folios), and high operational friction for a v1 launch.

## Decision
1. We implement a **Modular Monolith** architecture in NestJS within a single unified deployment boundary.
2. The REST API is strictly versioned under the `/api/v1` namespace.
3. The Property Management System (PMS) is the **single source of truth** for all properties, rooms, beds, inventory blocks, reservations, and folios. No other module maintains an independent or duplicate copy of inventory or billing state.
4. Internal modules communicate via typed domain services and event emitters rather than direct cross-table SQL mutations.
5. All database operations modifying inventory or financial status occur within explicit ACID transactions.

## Consequences
- **Positive:** Guaranteed consistency across inventory holds and bookings; fast local development; shared types; straightforward deployment.
- **Negative:** Requires disciplined boundaries within the codebase to prevent circular dependencies.
