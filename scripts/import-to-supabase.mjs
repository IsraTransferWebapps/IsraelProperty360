/**
 * Supabase Data Import Script
 *
 * Usage:
 *   1. First run export-base44-data.mjs to generate ./export/*.json files
 *   2. Run supabase/schema-additions.sql in the Supabase SQL editor
 *   3. Set environment variables:
 *        export SUPABASE_URL="https://your-project.supabase.co"
 *        export SUPABASE_SERVICE_KEY="your-service-role-key"  (NOT anon key)
 *   4. Run:  node scripts/import-to-supabase.mjs
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

// Base44 internal fields to strip from all records
const BASE44_INTERNAL_FIELDS = ['id', 'updated_date', 'created_by_id', 'created_by', 'is_sample'];

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

function transformRecord(record, table) {
  // Strip Base44 internal fields
  const clean = { ...record };
  for (const field of BASE44_INTERNAL_FIELDS) {
    delete clean[field];
  }

  // Table-specific transformations
  if (table === 'blog_posts') {
    // author_expert_id from Base44 is a string ID, not a UUID.
    // We can't FK-link it, so store author_name/author_expertise and clear the FK.
    delete clean.author_expert_id;
  }

  if (table === 'favorites') {
    // favorites.property_id from Base44 is a string, not UUID FK.
    // We drop it — favorites will need to be re-created after migration.
    delete clean.property_id;
  }

  if (table === 'cities') {
    // Map Base44 field name to our schema
    if (clean.average_property_price !== undefined) {
      clean.avg_price = clean.average_property_price;
      delete clean.average_property_price;
    }
  }

  // Remove null/undefined values to let Supabase defaults work
  for (const key of Object.keys(clean)) {
    if (clean[key] === null || clean[key] === undefined) {
      delete clean[key];
    }
  }

  return clean;
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

  // Insert in batches of 50 (smaller batches = better error messages)
  const batchSize = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < transformed.length; i += batchSize) {
    const batch = transformed.slice(i, i + batchSize);
    const { data, error } = await supabase.from(table).insert(batch).select('id');
    if (error) {
      console.error(`  [ERROR] ${table} batch ${i}: ${error.message}`);
      // Try inserting one by one to identify problematic records
      for (let j = 0; j < batch.length; j++) {
        const { error: singleError } = await supabase.from(table).insert(batch[j]);
        if (singleError) {
          console.error(`    Record ${i + j}: ${singleError.message}`);
          errors++;
        } else {
          inserted++;
        }
      }
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
  console.log('\nNOTE: User profiles are NOT imported — they are auto-created');
  console.log('when users register via the new email/password auth.');
  console.log('\nFavorites were imported without property_id links (IDs changed).');
  console.log('Blog post author_expert_id links were also cleared (IDs changed).');
  console.log('Author names are preserved in author_name/author_expertise fields.');
}

main().catch(console.error);
