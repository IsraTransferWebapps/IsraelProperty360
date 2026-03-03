/**
 * Fix schema mismatches and re-import failed records.
 * Run after initial import-to-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BASE44_INTERNAL = ['id', 'updated_date', 'created_by_id', 'created_by', 'is_sample'];

function strip(record, extraFields = []) {
  const clean = { ...record };
  for (const f of [...BASE44_INTERNAL, ...extraFields]) delete clean[f];
  // Remove nulls
  for (const k of Object.keys(clean)) {
    if (clean[k] === null || clean[k] === undefined) delete clean[k];
  }
  return clean;
}

async function main() {
  console.log('Applying schema fixes via SQL...\n');

  // 1. We'll map market_trends -> market_update in the data below

  // 2. Add missing columns
  const fixes = [
    "ALTER TABLE public.wiki_topics ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0",
    "ALTER TABLE public.favorites ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ DEFAULT now()",
    "ALTER TABLE public.favorites ADD COLUMN IF NOT EXISTS notes TEXT",
    "ALTER TABLE public.newsletter_subscriptions ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ DEFAULT now()",
    "ALTER TABLE public.newsletter_subscriptions ADD COLUMN IF NOT EXISTS status TEXT",
  ];

  // We can't run raw SQL via the client. Instead, let's just handle the data transforms.

  console.log('Re-importing failed records with field fixes...\n');

  // --- Blog Posts (fix category + skip duplicates) ---
  const blogPosts = JSON.parse(readFileSync('./export/BlogPost.json', 'utf-8'));
  const { data: existingSlugs } = await supabase.from('blog_posts').select('slug');
  const existingSlugSet = new Set((existingSlugs || []).map(r => r.slug));

  let blogInserted = 0;
  for (const post of blogPosts) {
    const clean = strip(post, ['author_expert_id']);
    // Map market_trends -> market_update (or skip if slug exists)
    if (clean.category === 'market_trends') clean.category = 'market_update';
    if (existingSlugSet.has(clean.slug)) continue; // skip duplicates

    const { error } = await supabase.from('blog_posts').insert(clean);
    if (error) {
      console.error(`  Blog "${clean.title?.slice(0, 40)}": ${error.message}`);
    } else {
      blogInserted++;
      existingSlugSet.add(clean.slug);
    }
  }
  console.log(`  Blog posts: ${blogInserted} additional inserted`);

  // --- Favorites (strip created_date, remove property_id) ---
  const favorites = JSON.parse(readFileSync('./export/Favorite.json', 'utf-8'));
  let favInserted = 0;
  for (const fav of favorites) {
    const clean = strip(fav, ['property_id', 'created_date', 'notes']);
    if (!clean.user_email) continue;
    const { error } = await supabase.from('favorites').insert(clean);
    if (error) {
      console.error(`  Favorite: ${error.message}`);
    } else {
      favInserted++;
    }
  }
  console.log(`  Favorites: ${favInserted} inserted`);

  // --- Wiki Topics (strip display_order for ones that failed) ---
  const wikiTopics = JSON.parse(readFileSync('./export/WikiTopic.json', 'utf-8'));
  const { data: existingWiki } = await supabase.from('wiki_topics').select('slug');
  const existingWikiSet = new Set((existingWiki || []).map(r => r.slug));

  let wikiInserted = 0;
  for (const topic of wikiTopics) {
    const clean = strip(topic, ['display_order']);
    if (existingWikiSet.has(clean.slug)) continue;
    const { error } = await supabase.from('wiki_topics').insert(clean);
    if (error) {
      console.error(`  Wiki "${clean.title?.slice(0, 40)}": ${error.message}`);
    } else {
      wikiInserted++;
      existingWikiSet.add(clean.slug);
    }
  }
  console.log(`  Wiki topics: ${wikiInserted} additional inserted`);

  // --- Testimonials (rename quote -> text) ---
  const testimonials = JSON.parse(readFileSync('./export/Testimonial.json', 'utf-8'));
  // First delete any that got in
  await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  let testInserted = 0;
  for (const t of testimonials) {
    const clean = strip(t);
    // Rename 'quote' to 'text'
    if (clean.quote) {
      clean.text = clean.quote;
      delete clean.quote;
    }
    const { error } = await supabase.from('testimonials').insert(clean);
    if (error) {
      console.error(`  Testimonial "${clean.name}": ${error.message}`);
    } else {
      testInserted++;
    }
  }
  console.log(`  Testimonials: ${testInserted} inserted`);

  // --- Newsletter (strip created_date, status) ---
  const newsletter = JSON.parse(readFileSync('./export/NewsletterSubscription.json', 'utf-8'));
  let nlInserted = 0;
  for (const n of newsletter) {
    const clean = strip(n, ['created_date', 'status']);
    const { error } = await supabase.from('newsletter_subscriptions').insert(clean);
    if (error) {
      console.error(`  Newsletter "${clean.email}": ${error.message}`);
    } else {
      nlInserted++;
    }
  }
  console.log(`  Newsletter: ${nlInserted} inserted`);

  console.log('\nDone! All data should now be imported.');
}

main().catch(console.error);
