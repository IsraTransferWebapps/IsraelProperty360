/**
 * Supabase Data Import Script
 *
 * Usage:
 *   1. First run export-base44-data.mjs to generate ./export/*.json files
 *   2. Set environment variables:
 *        export SUPABASE_URL="https://your-project.supabase.co"
 *        export SUPABASE_SERVICE_KEY="your-service-role-key"  (NOT anon key)
 *   3. Run:  node scripts/import-to-supabase.mjs
 *
 * Note: Uses the service role key to bypass RLS during import.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Import order respects foreign key dependencies
const IMPORT_ORDER = [
  { file: 'City', table: 'cities' },
  { file: 'Expert', table: 'experts' },
  { file: 'Property', table: 'properties' },
  { file: 'BlogPost', table: 'blog_posts' },
  { file: 'Event', table: 'events' },
  { file: 'Favorite', table: 'favorites' },
  { file: 'WikiTopic', table: 'wiki_topics' },
  { file: 'Testimonial', table: 'testimonials' },
  { file: 'NewsletterSubscription', table: 'newsletter_subscriptions' },
];

// Map Base44 field names to Supabase column names if they differ
function transformRecord(record, table) {
  // Remove Base44-internal fields
  const { __type, __created, __updated, ...clean } = record;

  // Base44 uses 'id' as a string — Supabase uses UUID.
  // We drop the old ID and let Supabase generate a new UUID.
  // If you need to preserve IDs for FK mapping, adjust this.
  const { id: oldId, ...data } = clean;

  return data;
}

async function importEntity({ file, table }) {
  const filePath = `./export/${file}.json`;

  if (!existsSync(filePath)) {
    console.warn(`  [SKIP] ${filePath} not found`);
    return;
  }

  const records = JSON.parse(readFileSync(filePath, 'utf-8'));
  if (!records.length) {
    console.log(`  [EMPTY] ${file}: 0 records`);
    return;
  }

  const transformed = records.map((r) => transformRecord(r, table));

  // Insert in batches of 100
  const batchSize = 100;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < transformed.length; i += batchSize) {
    const batch = transformed.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.error(`  [ERROR] ${table} batch ${i}: ${error.message}`);
      errors += batch.length;
    } else {
      inserted += batch.length;
    }
  }

  console.log(`  [OK] ${table}: ${inserted} inserted, ${errors} errors (from ${records.length} records)`);
}

async function main() {
  console.log('Starting Supabase data import...\n');

  for (const entity of IMPORT_ORDER) {
    await importEntity(entity);
  }

  console.log('\nImport complete!');
  console.log('\nNOTE: User profiles are NOT imported here because they must be');
  console.log('linked to Supabase auth.users. Users will get profiles auto-created');
  console.log('when they sign in via Google OAuth for the first time.');
  console.log('\nTo import admin users, manually insert into the profiles table');
  console.log('after they have signed in, setting role = "admin".');
}

main().catch(console.error);
