# HOTELYO - Local Environment Setup Guide

## 1. Prerequisites
- Node.js >= 20 (Node v24 supported)
- pnpm >= 9.0 (`pnpm -v`)
- PostgreSQL 17 (Running on port 5433 or via Docker)
- Redis 7 (or mock queue mode)

## 2. Quickstart Steps
1. **Clone repository & Install dependencies:**
   ```bash
   git clone <repo-url> HOTELYO
   cd HOTELYO
   pnpm install
   ```
2. **Environment Configuration:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Database Setup & Migrations:**
   Ensure PostgreSQL is running on port 5433 (or standard port in `.env`):
   ```bash
   pnpm prisma migrate dev --name init
   pnpm prisma db seed
   ```
4. **Run Application Services:**
   - Run backend API: `pnpm --filter api dev`
   - Run guest web: `pnpm --filter guest-web dev`
   - Run staff web: `pnpm --filter staff-web dev`
   - Run admin web: `pnpm --filter admin-web dev`
   - Run all concurrently: `pnpm dev`
5. **Run Test Suites:**
   ```bash
   pnpm test
   ```
