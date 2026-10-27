# HOTELYO - Deployment Runbook

## 1. Prerequisites
- Docker & Docker Compose or Kubernetes cluster (AWS ECS / EKS India Region: `ap-south-1`).
- Managed PostgreSQL 17 (AWS RDS / GCP Cloud SQL).
- Managed Redis (AWS ElastiCache).
- S3 Bucket with private ACL and CORS configured.

## 2. Step-by-Step Deployment Procedure
1. **Environment Configuration:**
   Verify `.env.production` contains valid cryptographic secrets, database credentials, and gateway keys.
2. **Database Migration Check:**
   Run Prisma migration in deploy mode:
   ```bash
   pnpm prisma migrate deploy
   ```
3. **Application Build:**
   ```bash
   pnpm build
   ```
4. **Health Check Verification:**
   Query `/api/v1/health` and `/api/v1/health/ready` to verify database and redis connectivity.
5. **Worker Verification:**
   Ensure BullMQ queue workers for hold expiry and motorcycle auto-release are running and listening.
