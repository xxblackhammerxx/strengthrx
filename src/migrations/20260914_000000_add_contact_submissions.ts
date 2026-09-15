import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM(
        'new',
        'in-progress',
        'responded',
        'resolved',
        'archived'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "contact_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "phone" varchar,
      "subject" varchar,
      "message" varchar NOT NULL,
      "utm_source" varchar,
      "utm_medium" varchar,
      "utm_campaign" varchar,
      "utm_content" varchar,
      "utm_term" varchar,
      "landing_page" varchar,
      "campaign_ref" varchar,
      "campaign_topic" varchar,
      "referrer" varchar,
      "status" "public"."enum_contact_submissions_status" DEFAULT 'new',
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "contact_submissions_updated_at_idx"
      ON "contact_submissions" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "contact_submissions_created_at_idx"
      ON "contact_submissions" USING btree ("created_at");

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD COLUMN "contact_submissions_id" integer;
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_submissions_id_idx"
      ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk"
        FOREIGN KEY ("contact_submissions_id")
        REFERENCES "public"."contact_submissions"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_contact_submissions_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_contact_submissions_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "contact_submissions_id";
    DROP TABLE IF EXISTS "contact_submissions" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_contact_submissions_status";
  `)
}
