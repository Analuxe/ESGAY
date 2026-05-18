const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('Testing connection to Supabase...');
  try {
    const { data: vendors, error: vErr } = await supabase.from('vendors').select('*');
    console.log('VENDORS:', vendors, 'ERROR:', vErr);

    const { data: artifacts, error: aErr } = await supabase.from('artifacts').select('*').limit(1);
    console.log('ARTIFACTS:', artifacts, 'ERROR:', aErr);

    const { data: admins, error: adErr } = await supabase.from('admins').select('*');
    console.log('ADMINS:', admins, 'ERROR:', adErr);
  } catch (err) {
    console.error('Crash:', err);
  }
}

test();
