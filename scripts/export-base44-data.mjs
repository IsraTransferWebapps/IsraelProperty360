/**
 * Base44 Data Export Script
 *
 * Usage:
 *   1. Temporarily re-install @base44/sdk:  npm install @base44/sdk
 *   2. Set environment variables:
 *        export BASE44_APP_ID="your-app-id"
 *        export BASE44_SERVER_URL="https://your-server.base44.com"
 *        export BASE44_TOKEN="your-access-token"
 *   3. Run:  node scripts/export-base44-data.mjs
 *   4. Data will be saved to ./export/{entity}.json
 *   5. Uninstall when done:  npm uninstall @base44/sdk
 */

import { createClient } from '@base44/sdk';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const appId = process.env.BASE44_APP_ID;
const serverUrl = process.env.BASE44_SERVER_URL;
const token = process.env.BASE44_TOKEN;

if (!appId || !serverUrl || !token) {
  console.error('Missing environment variables. Set BASE44_APP_ID, BASE44_SERVER_URL, BASE44_TOKEN');
  process.exit(1);
}

const base44 = createClient({ appId, serverUrl, token, requiresAuth: false });

const ENTITIES = [
  'Property',
  'Expert',
  'BlogPost',
  'Event',
  'Favorite',
  'City',
  'WikiTopic',
  'Testimonial',
  'NewsletterSubscription',
];

const outputDir = './export';

async function main() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting Base44 data export...\n');

  for (const entityName of ENTITIES) {
    try {
      const entity = base44.entities[entityName];
      if (!entity) {
        console.warn(`  [SKIP] Entity "${entityName}" not found in SDK`);
        continue;
      }

      const records = await entity.list();
      const filePath = `${outputDir}/${entityName}.json`;
      writeFileSync(filePath, JSON.stringify(records, null, 2));
      console.log(`  [OK] ${entityName}: ${records.length} records → ${filePath}`);
    } catch (err) {
      console.error(`  [ERROR] ${entityName}: ${err.message}`);
    }
  }

  // Export users separately via auth
  try {
    const users = await base44.entities.User?.list?.() || [];
    const filePath = `${outputDir}/User.json`;
    writeFileSync(filePath, JSON.stringify(users, null, 2));
    console.log(`  [OK] User: ${users.length} records → ${filePath}`);
  } catch (err) {
    console.warn(`  [WARN] User export failed: ${err.message}`);
    console.log('  You may need to export users manually from the Base44 dashboard.');
  }

  console.log('\nExport complete! Files saved to ./export/');
  console.log('Next step: Run scripts/import-to-supabase.mjs to import into Supabase.');
}

main().catch(console.error);
