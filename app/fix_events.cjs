const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://hkgdihysekabkimqyyxs.supabase.co';
const supabaseAnonKey = 'sb_publishable_oMZ1Zo46hcceWkoGtSJQ3g_lIZawnYa';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixSchema() {
  const sql = `
    ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
    
    ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS short_description JSONB;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_image TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS flyer TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery JSONB;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS time TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS venue TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS city TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS state TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_links JSONB;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS featured_home BOOLEAN DEFAULT false;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
  `;
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
     console.error("RPC Error:", error);
  } else {
    console.log('Fixed:', data);
  }
}
fixSchema();
