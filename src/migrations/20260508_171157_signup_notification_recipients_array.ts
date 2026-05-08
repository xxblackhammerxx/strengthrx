import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Replace the single-value `new_client_notification_recipient` column
  // with the generic `site_settings_texts` hasMany join table that Payload
  // uses for hasMany text fields on the site-settings global.
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "new_client_notification_recipient";

    CREATE TABLE IF NOT EXISTS "site_settings_texts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "text" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "site_settings_texts"
        ADD CONSTRAINT "site_settings_texts_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_texts_order_parent"
      ON "site_settings_texts" USING btree ("order","parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_texts" CASCADE;

    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "new_client_notification_recipient" varchar
      DEFAULT 'eric@gainzmarketing.com';
  `)
}
