# HOTELYO - Rollback Runbook

## 1. Rollback Triggers
- Unhandled critical exceptions (> 1% error rate on `/api/v1/bookings/*` or `/api/v1/payments/*`).
- Booking hold failures or database deadlock alerts.
- Payment webhook verification failures.

## 2. Rollback Execution Procedure
1. **Traffic Divergence:**
   Redirect application load balancer traffic to the previous stable release container image.
2. **Database Schema Rollback:**
   If a migration was applied:
   - Check if backward compatibility was preserved (expand/contract pattern).
   - If a rollback script exists, run `prisma migrate resolve --rolled-back <migration_name>` or execute the targeted down migration.
3. **Queue Drain & Flush:**
   Inspect BullMQ failed jobs queue and pause consumer workers if bad payloads are looping.
4. **Post-Rollback Smoke Test:**
   Execute health check and run smoke test booking checkout scenario.
