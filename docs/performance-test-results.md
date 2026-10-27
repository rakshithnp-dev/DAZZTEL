# HOTELYO - Performance Test Benchmarks & Latency Targets

## 1. Non-Functional Performance Targets (RFQ Baseline)

| Measurement Area | Target SLA | Strategy & Implementation | Status |
|---|---|---|---|
| **Mobile Page Load (LCP)** | LCP < 2.5 seconds on mid-range 4G phone | Next.js App Router server components, image optimization, minimal client bundle, responsive Tailwind CSS | Target Established |
| **API Read Latency** | p95 < 300 ms | Indexed PostgreSQL foreign keys and calendar queries, Redis caching for property catalogs | Target Established |
| **API Write Latency** | p95 < 600 ms | Lean transactions, asynchronous background job queuing via BullMQ for non-critical side effects | Target Established |
| **Search Latency** | p95 < 800 ms | Composite index `(bedId, calendarDate)` on `BedNightAllocation`, fast date-range filtering | Target Established |
| **Concurrency** | 200 concurrent users (Option A); 500 (Option B) | Node.js asynchronous event loop, connection pooling, non-blocking I/O | Target Established |
| **Monthly Availability** | 99.5% Platform; 99.9% SOS Service | Multi-AZ database failover, health checks, durable queue retries | Target Established |
| **Disaster Recovery** | RPO <= 15 minutes; RTO <= 4 hours | Continuous WAL archiving, daily automated backups with point-in-time recovery | Target Established |

## 2. Load Testing Scenarios (k6 Specification)
- `search_and_availability.js`: Simulates 200 virtual users querying bed availability across random 1-7 night intervals.
- `concurrent_booking_holds.js`: Stresses 50 concurrent requests competing for 5 physical beds to verify zero 500 internal server errors and deterministic 409 Conflict handling.
