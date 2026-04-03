import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create new enum types (idempotent via DO blocks)
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_clients_goals" AS ENUM('lose_weight', 'more_energy', 'less_burnout', 'build_muscle', 'sexual_wellness', 'other');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_clients_labs_status" AS ENUM('yes', 'no');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_clients_practice_better_sync_status" AS ENUM('pending', 'synced', 'failed');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  `)

  // Create clients_goals join table for hasMany select
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "clients_goals" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_goals",
  	"id" serial PRIMARY KEY NOT NULL
  );
  `)

  // Add FK constraint (idempotent)
  await db.execute(sql`
   DO $$ BEGIN
    ALTER TABLE "clients_goals" ADD CONSTRAINT "clients_goals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  `)

  // Create indexes
  await db.execute(sql`
   CREATE INDEX IF NOT EXISTS "clients_goals_order_idx" ON "clients_goals" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "clients_goals_parent_idx" ON "clients_goals" USING btree ("parent_id");
  `)

  // Add new columns to clients table (idempotent)
  await db.execute(sql`
   DO $$ BEGIN
    ALTER TABLE "clients" ADD COLUMN "labs_status" "enum_clients_labs_status";
  EXCEPTION WHEN duplicate_column THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "clients" ADD COLUMN "practice_better_id" varchar;
  EXCEPTION WHEN duplicate_column THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "clients" ADD COLUMN "practice_better_sync_status" "enum_clients_practice_better_sync_status" DEFAULT 'pending';
  EXCEPTION WHEN duplicate_column THEN null;
  END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" DROP COLUMN IF EXISTS "labs_status";
  ALTER TABLE "clients" DROP COLUMN IF EXISTS "practice_better_id";
  ALTER TABLE "clients" DROP COLUMN IF EXISTS "practice_better_sync_status";
  DROP TABLE IF EXISTS "clients_goals" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_clients_goals";
  DROP TYPE IF EXISTS "public"."enum_clients_labs_status";
  DROP TYPE IF EXISTS "public"."enum_clients_practice_better_sync_status";
  `)
}
