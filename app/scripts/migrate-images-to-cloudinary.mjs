/**
 * MIGRAÇÃO: Supabase Storage (site-images) → Cloudinary
 *
 * O que faz:
 *   1. Lista todos os arquivos do bucket `site-images` (recursivo)
 *   2. Sobe cada IMAGEM no Cloudinary (preset unsigned `queromais_site`)
 *      - vídeos (mp4/webm/mov) são pulados — continuam no Supabase
 *   3. Varre todas as tabelas e substitui as URLs antigas pelas novas
 *      (funciona também dentro de colunas JSON, ex: site_config)
 *
 * Como rodar (PowerShell, na pasta app/):
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "cole-a-service-role-key-aqui"
 *   node scripts/migrate-images-to-cloudinary.mjs --dry-run   # simula, não altera nada
 *   node scripts/migrate-images-to-cloudinary.mjs             # executa de verdade
 *
 * A service_role key fica em: Supabase Dashboard → Project Settings → API
 * (NUNCA commitar essa chave — usar só via variável de ambiente)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes('--dry-run');

// ── Config ───────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = 'qsabwf5z';
const CLOUDINARY_UPLOAD_PRESET = 'queromais_site';
const BUCKETS = ['site-images', 'galleries'];
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

// Tabelas que podem conter URLs de imagem (todas varridas genericamente)
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

// ── Env: lê VITE_SUPABASE_URL do app/.env ────────────────────
function readEnvFile() {
  const vars = {};
  for (const name of ['.env', '.env.local']) {
    try {
      const content = readFileSync(resolve(__dirname, '..', name), 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\r\n]+)"?/);
        if (m) vars[m[1]] = m[2];
      }
    } catch { /* arquivo pode não existir */ }
  }
  return vars;
}

const envFile = readEnvFile();
const SUPABASE_URL = process.env.SUPABASE_URL || envFile.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL não encontrada no app/.env nem em SUPABASE_URL.');
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error('❌ Defina SUPABASE_SERVICE_ROLE_KEY (Dashboard → Project Settings → API).');
  console.error('   PowerShell: $env:SUPABASE_SERVICE_ROLE_KEY = "sua-chave"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── 1. Listar arquivos de um bucket (recursivo) ──────────────
async function listAllFiles(bucket, prefix = '') {
  const files = [];
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) throw new Error(`Erro listando "${bucket}/${prefix}": ${error.message}`);
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) {
      // é uma pasta
      files.push(...await listAllFiles(bucket, path));
    } else {
      files.push({ bucket, path, size: item.metadata?.size ?? 0 });
    }
  }
  return files;
}

// ── 2. Upload para o Cloudinary ──────────────────────────────
async function uploadToCloudinary(buffer, contentType, folder) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: contentType }));
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  form.append('folder', `site/migrado/${folder}`.replace(/\/$/, ''));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error?.message || `HTTP ${res.status}`);
  return body.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

// ── 3. Substituição profunda de URLs (strings e JSON) ────────
function deepReplace(value, urlMap) {
  if (typeof value === 'string') {
    let out = value;
    for (const [oldUrl, newUrl] of urlMap) {
      if (out.includes(oldUrl)) out = out.split(oldUrl).join(newUrl);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map(v => deepReplace(v, urlMap));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepReplace(v, urlMap);
    return out;
  }
  return value;
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log(`\n${DRY_RUN ? '🔍 DRY-RUN (nada será alterado)' : '🚀 MIGRAÇÃO REAL'}\n`);

  console.log('📂 Listando arquivos dos buckets...');
  const files = [];
  for (const bucket of BUCKETS) {
    try {
      const bucketFiles = await listAllFiles(bucket);
      console.log(`   ${bucket}: ${bucketFiles.length} arquivos`);
      files.push(...bucketFiles);
    } catch (err) {
      console.log(`   ⚠️  ${bucket}: ${err.message}`);
    }
  }
  const images = files.filter(f => !VIDEO_EXTS.includes(f.path.split('.').pop().toLowerCase()));
  const videos = files.length - images.length;
  const totalMB = (images.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);
  console.log(`   Total: ${files.length} arquivos | ${images.length} imagens (${totalMB} MB) | ${videos} vídeos (pulados)\n`);

  // Upload de cada imagem
  const urlMap = new Map(); // URL antiga → URL nova
  const failed = [];
  let done = 0;

  for (const file of images) {
    const oldUrl = `${SUPABASE_URL}/storage/v1/object/public/${file.bucket}/${file.path}`;
    const folder = file.path.includes('/') ? file.path.slice(0, file.path.lastIndexOf('/')) : '';
    done++;

    if (DRY_RUN) {
      console.log(`   [${done}/${images.length}] (dry) ${file.bucket}/${file.path} (${(file.size / 1024).toFixed(0)} KB)`);
      continue;
    }

    try {
      const { data, error } = await supabase.storage.from(file.bucket).download(file.path);
      if (error) throw new Error(error.message);
      const buffer = Buffer.from(await data.arrayBuffer());
      const newUrl = await uploadToCloudinary(buffer, data.type, folder);
      urlMap.set(oldUrl, newUrl);
      console.log(`   [${done}/${images.length}] ✅ ${file.bucket}/${file.path}`);
    } catch (err) {
      failed.push({ path: `${file.bucket}/${file.path}`, error: err.message });
      console.log(`   [${done}/${images.length}] ❌ ${file.bucket}/${file.path} — ${err.message}`);
    }
  }

  if (DRY_RUN) {
    console.log('\n🔍 Dry-run concluído. Rode sem --dry-run para migrar.');
    return;
  }

  // Também mapeia URLs sem o prefixo completo? Não — replace por URL exata basta.
  console.log(`\n🗄️  Atualizando URLs no banco (${urlMap.size} imagens migradas)...`);
  const urlEntries = [...urlMap.entries()];

  for (const table of TABLES) {
    const { data: rows, error } = await supabase.from(table).select('*');
    if (error) {
      console.log(`   ⚠️  ${table}: ${error.message}`);
      continue;
    }
    let updated = 0;
    for (const row of rows ?? []) {
      const replaced = deepReplace(row, urlEntries);
      const changedCols = {};
      for (const key of Object.keys(row)) {
        if (JSON.stringify(row[key]) !== JSON.stringify(replaced[key])) {
          changedCols[key] = replaced[key];
        }
      }
      if (Object.keys(changedCols).length > 0) {
        const { error: upErr } = await supabase.from(table).update(changedCols).eq('id', row.id);
        if (upErr) console.log(`   ⚠️  ${table} id=${row.id}: ${upErr.message}`);
        else updated++;
      }
    }
    console.log(`   ${table}: ${updated} linha(s) atualizada(s)`);
  }

  // Resumo
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Migradas:  ${urlMap.size}/${images.length} imagens`);
  if (failed.length > 0) {
    console.log(`❌ Falharam:  ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.path}: ${f.error}`));
  }
  console.log('\n⚠️  Arquivos antigos NÃO foram apagados do Supabase.');
  console.log('   Valide o site primeiro; depois delete pelo painel Storage se quiser liberar espaço.');
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
