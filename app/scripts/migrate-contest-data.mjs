/**
 * MIGRAÇÃO DE DADOS: DJ Contest → projeto Supabase dedicado
 *
 * Copia dj_participants, dj_contest_settings e dj_votes do projeto
 * principal para o projeto novo (IDs preservados).
 *
 * PRÉ-REQUISITO: rodar supabase/contest_project_schema.sql no projeto novo.
 *
 * Como rodar (PowerShell, na pasta app/):
 *   $env:SUPABASE_SERVICE_ROLE_KEY     = "service-role-key-do-projeto-ANTIGO"
 *   $env:NEW_SUPABASE_URL              = "https://xxxx.supabase.co"   # projeto NOVO
 *   $env:NEW_SUPABASE_SERVICE_ROLE_KEY = "service-role-key-do-projeto-NOVO"
 *   node scripts/migrate-contest-data.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readEnvFile() {
  const vars = {};
  for (const name of ['.env', '.env.local']) {
    try {
      const content = readFileSync(resolve(__dirname, '..', name), 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\r\n]+)"?/);
        if (m) vars[m[1]] = m[2];
      }
    } catch { /* ok */ }
  }
  return vars;
}

const envFile = readEnvFile();
const OLD_URL = process.env.SUPABASE_URL || envFile.VITE_SUPABASE_URL;
const OLD_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NEW_URL = process.env.NEW_SUPABASE_URL;
const NEW_KEY = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY;

if (!OLD_URL || !OLD_KEY || !NEW_URL || !NEW_KEY) {
  console.error('❌ Defina: SUPABASE_SERVICE_ROLE_KEY (antigo), NEW_SUPABASE_URL e NEW_SUPABASE_SERVICE_ROLE_KEY (novo).');
  process.exit(1);
}

const oldDb = createClient(OLD_URL, OLD_KEY);
const newDb = createClient(NEW_URL, NEW_KEY);

async function copyTable(table, { upsertOn = 'id' } = {}) {
  const { data, error } = await oldDb.from(table).select('*');
  if (error) throw new Error(`Lendo ${table}: ${error.message}`);
  if (!data || data.length === 0) {
    console.log(`   ${table}: 0 linhas (nada a copiar)`);
    return;
  }
  const { error: insError } = await newDb.from(table).upsert(data, { onConflict: upsertOn });
  if (insError) throw new Error(`Gravando ${table}: ${insError.message}`);
  console.log(`   ${table}: ${data.length} linha(s) copiada(s)`);
}

async function main() {
  console.log('\n🚚 Copiando dados do DJ Contest para o projeto novo...\n');

  // Ordem importa: participantes antes (votos e winner_id referenciam)
  await copyTable('dj_participants');
  await copyTable('dj_contest_settings');
  await copyTable('dj_votes');

  console.log('\n✅ Migração de dados concluída.');
  console.log('   Próximo passo: configurar VITE_CONTEST_SUPABASE_URL e');
  console.log('   VITE_CONTEST_SUPABASE_ANON_KEY no app/.env e na Vercel.');
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
