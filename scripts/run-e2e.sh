#!/usr/bin/env bash
set -e

echo "Ensuring database is running..."
docker compose up -d postgres

echo "Waiting for postgres to be ready..."
until docker exec fixli-db pg_isready -U fixli; do
  sleep 1
done

echo "Running E2E tests..."
export DATABASE_URL="postgresql://fixli:password@localhost:5434/fixli?schema=public"
pnpm --filter @fixli/api test:e2e
