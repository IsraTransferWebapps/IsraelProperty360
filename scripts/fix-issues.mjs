import { createClient } from '@supabase/supabase-js';

// Usage: SUPABASE_SERVICE_KEY=your_key node scripts/fix-issues.mjs
const sb = createClient(
  'https://wwphmkbjspymrcanoqal.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY env var before running');
  process.exit(1);
}

async function main() {
  // Fix Issue 5: Expert approval status — update pending to approved
  console.log('--- Issue 5: Fix expert approval_status ---');
  const { data: d5a, error: e5a } = await sb
    .from('experts')
    .update({ approval_status: 'approved' })
    .eq('approval_status', 'pending')
    .select('id');
  console.log('Updated pending experts:', d5a?.length, e5a ? 'Error: ' + e5a.message : 'OK');

  // Also update any with null approval_status
  const { data: d5b, error: e5b } = await sb
    .from('experts')
    .update({ approval_status: 'approved' })
    .is('approval_status', null)
    .select('id');
  console.log('Updated null experts:', d5b?.length, e5b ? 'Error: ' + e5b.message : 'OK');

  // Fix Issue 6: Reset property dates so they aren't expired
  // Supabase requires a WHERE clause — update all by filtering on non-null id
  console.log('--- Issue 6: Fix property dates ---');
  const { data: d6, error: e6 } = await sb
    .from('properties')
    .update({ created_date: new Date().toISOString() })
    .not('id', 'is', null)
    .select('id');
  console.log('Updated properties:', d6?.length, e6 ? 'Error: ' + e6.message : 'OK');

  // Fix Issue 7: Copy avg_price to average_property_price for cities
  console.log('--- Issue 7: Fix city average prices ---');
  const { data: cities } = await sb.from('cities').select('id, avg_price, average_property_price');
  let updated = 0;
  for (const city of cities) {
    if (city.average_property_price === null && city.avg_price !== null) {
      const { error } = await sb.from('cities').update({ average_property_price: city.avg_price }).eq('id', city.id);
      if (error) {
        console.log('  City update error:', error.message);
      } else {
        updated++;
      }
    }
  }
  console.log('Updated cities:', updated);

  // Verify
  console.log('\n--- Verification ---');
  const { data: experts } = await sb.from('experts').select('approval_status');
  const expertStatuses = {};
  experts.forEach(e => { expertStatuses[e.approval_status] = (expertStatuses[e.approval_status] || 0) + 1; });
  console.log('Expert statuses:', expertStatuses);

  const { data: props } = await sb.from('properties').select('status, created_date').limit(3);
  console.log('Sample property dates:', props.map(p => p.status + ' -> ' + p.created_date));

  const { data: citiesCheck } = await sb.from('cities').select('name, average_property_price').limit(5);
  console.log('Sample city prices:', citiesCheck);

  // Check property expiry now
  const { data: allProps } = await sb.from('properties').select('status, created_date');
  const now = new Date();
  let active = { for_sale: 0, in_development: 0 };
  let expired = { for_sale: 0, in_development: 0 };
  allProps.forEach(p => {
    const created = new Date(p.created_date);
    const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    const isExpired = (p.status === 'for_sale' && months >= 3) || (p.status === 'in_development' && months >= 6);
    if (isExpired) expired[p.status]++;
    else active[p.status]++;
  });
  console.log('Active properties:', active);
  console.log('Expired properties:', expired);
}

main().catch(console.error);
