# HOTELYO - Backup and Disaster Recovery Runbook

## 1. Objectives
- **Recovery Point Objective (RPO):** <= 15 minutes.
- **Recovery Time Objective (RTO):** <= 4 hours.

## 2. Backup Strategy
1. **Automated Daily Snapshots:** Automated RDS snapshots taken daily at 02:00 IST.
2. **Continuous WAL Archiving:** Write-Ahead Logs streamed continuously to encrypted S3 bucket (`ap-south-1`) enabling point-in-time recovery (PITR) to any second within the retention window (35 days).
3. **Object Storage Replication:** S3 bucket versioning enabled with cross-region replication for identity documents.

## 3. Restoration Drill Procedure
1. Create a restoration target database instance from PITR timestamp:
   ```bash
   pg_restore -h <target_host> -p 5432 -U postgres -d hotelyo_recovery <backup_file>
   ```
2. Verify integrity by checking matching row counts on `BedNightAllocation`, `Booking`, `TaxInvoice`, and `DailyClose`.
3. Switch application `DATABASE_URL` and restart API services.
