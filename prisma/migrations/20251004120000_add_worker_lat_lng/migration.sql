-- Create-only migration to add latitude/longitude to WorkerProfile
-- Use IF NOT EXISTS to be safe when applying to existing DBs
ALTER TABLE "WorkerProfile"
ADD COLUMN IF NOT EXISTS "latitude" double precision;

ALTER TABLE "WorkerProfile"
ADD COLUMN IF NOT EXISTS "longitude" double precision;
