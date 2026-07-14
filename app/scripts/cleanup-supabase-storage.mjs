/**
 * LIMPEZA: remove do Supabase Storage arquivos que não são mais usados.
 *
 * Regras de segurança (arquivo só é apagado se passar em TODAS):
 *   1. NÃO é vídeo (mp4/webm/mov/avi/mkv ficam sempre — hero usa)
 *   2. A URL pública dele NÃO aparece em NENHUMA tabela do banco
 *
 * Como rodar (PowerShell, na pasta app/):
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "cole-a-service-role-key-aqui"
 *   node scripts/cleanup-supabase-storage.mjs --dry-run   # mostra o que apagaria
 *   node scripts/cleanup-supabase-storage.mjs             # apaga de verdade
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes('--dry-run');

const BUCKETS = ['site-images', 'galleries'];
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

// Todas as tabelas conhecidas — o conteúdo inteiro (JSON) é varrido por URL
const TABLES = [
  'site_config',
  'events',
  'events_meta',
  'gallery_albums',
  'gallery_videos_new',
  'banners',
  'djs',
  'dj_sets',
  'playlists',
  'products',
  'tickets',
  'faqs',
  'about_founder_profile',
  'contact_info',
  'dj_participants',
  'dj_contest_settings',
  'event_discount_lists',
];

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
const SUPABASE_URL = process.env.SUPABASE_URL || envFile.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Precisa de VITE_SUPABASE_URL (app/.env) e SUPABASE_SERVICE_ROLE_KEY (env).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function listAllFiles(bucket, prefix = '') {
  const files = [];
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) throw new Error(`Erro listando "${bucket}/${prefix}": ${error.message}`);
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) {
      files.push(...await listAllFiles(bucket, path));
    } else {
      files.push({ bucket, path, size: item.metadata?.size ?? 0 });
    }
  }
  return files;
}

async function main() {
  console.log(`\n${DRY_RUN ? '🔍 DRY-RUN (nada será apagado)' : '🗑️  LIMPEZA REAL'}\n`);

  // 1. Baixa conteúdo inteiro do banco como texto (pra busca de URL)
  console.log('🗄️  Carregando todas as tabelas...');
  let dbText = '';
  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.log(`   ⚠️  ${table}: ${error.message} (ignorada)`);
      continue;
    }
    dbText += JSON.stringify(data ?? []);
  }
  console.log(`   ${(dbText.length / 1024).toFixed(0)} KB de dados carregados\n`);

  // 2. Lista arquivos e classifica
  const keep = [];
  const remove = [];

  for (const bucket of BUCKETS) {
    let files = [];
    try {
      files = await listAllFiles(bucket);
    } catch (err) {
      console.log(`   ⚠️  ${bucket}: ${err.message}`);
      continue;
    }
    for (const file of files) {
      const ext = file.path.split('.').pop().toLowerCase();
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${file.bucket}/${file.path}`;
      if (VIDEO_EXTS.includes(ext)) {
        keep.push({ ...file, reason: 'vídeo' });
      } else if (dbText.includes(publicUrl)) {
        keep.push({ ...file, reason: 'referenciado no banco' });
      } else {
        remove.push(file);
      }
    }
  }

  const removeMB = (remove.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);
  const keepMB = (keep.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);

  console.log(`✅ Manter: ${keep.length} arquivos (${keepMB} MB)`);
  for (const f of keep) console.log(`   [mantém: ${f.reason}] ${f.bucket}/${f.path}`);

  console.log(`\n🗑️  Apagar: ${remove.length} arquivos (${removeMB} MB)`);
  for (const f of remove) console.log(`   ${f.bucket}/${f.path} (${(f.size / 1024).toFixed(0)} KB)`);

  if (DRY_RUN) {
    console.log('\n🔍 Dry-run concluído. Rode sem --dry-run para apagar.');
    return;
  }

  if (remove.length === 0) {
    console.log('\nNada para apagar.');
    return;
  }

  // 3. Apaga em lotes de 100 por bucket
  console.log('\n🗑️  Apagando...');
  for (const bucket of BUCKETS) {
    const paths = remove.filter(f => f.bucket === bucket).map(f => f.path);
    for (let i = 0; i < paths.length; i += 100) {
      const batch = paths.slice(i, i + 100);
      const { error } = await supabase.storage.from(bucket).remove(batch);
      if (error) console.log(`   ❌ ${bucket} (lote ${i / 100 + 1}): ${error.message}`);
      else console.log(`   ✅ ${bucket}: ${batch.length} arquivo(s) apagado(s)`);
    }
  }

  console.log(`\n✅ Limpeza concluída: ${remove.length} arquivos (${removeMB} MB) removidos.`);
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
