/**
 * MIGRAÇÃO DE USUÁRIOS ADMIN: projeto principal → projeto do DJ Contest
 *
 * Copia os usuários com a MESMA senha (via hash bcrypt) — ninguém precisa
 * saber ou trocar senha. Login fica idêntico nos dois projetos.
 *
 * PASSO 1 — No SQL Editor do projeto ANTIGO, rode:
 *
 *   select json_agg(json_build_object('email', email, 'hash', encrypted_password))
 *   from auth.users;
 *
 *   Copie o resultado (um JSON tipo [{"email":"...","hash":"$2a$10$..."}]).
 *
 * PASSO 2 — Salve esse JSON em app/scripts/users.json
 *
 * PASSO 3 — Rode (PowerShell, na pasta app/):
 *   $env:NEW_SUPABASE_URL              = "https://xxxx.supabase.co"
 *   $env:NEW_SUPABASE_SERVICE_ROLE_KEY = "service-role do projeto NOVO"
 *   node scripts/migrate-contest-users.mjs
 *
 * PASSO 4 — DELETE o arquivo users.json depois (contém hashes de senha).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const NEW_URL = process.env.NEW_SUPABASE_URL;
const NEW_KEY = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY;

if (!NEW_URL || !NEW_KEY) {
  console.error('❌ Defina NEW_SUPABASE_URL e NEW_SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const usersPath = resolve(__dirname, 'users.json');
if (!existsSync(usersPath)) {
  console.error('❌ Crie app/scripts/users.json com o resultado da query (veja instruções no topo deste arquivo).');
  process.exit(1);
}

const users = JSON.parse(readFileSync(usersPath, 'utf8'));
const newDb = createClient(NEW_URL, NEW_KEY);

for (const u of users) {
  if (!u.email || !u.hash) {
    console.log(`   ⚠️  Ignorado (sem email/hash): ${JSON.stringify(u).slice(0, 60)}`);
    continue;
  }
  const { error } = await newDb.auth.admin.createUser({
    email: u.email,
    password_hash: u.hash,
    email_confirm: true,
  });
  if (error) {
    if (error.message?.includes('already been registered')) {
      console.log(`   ⏭️  ${u.email}: já existe no projeto novo`);
    } else {
      console.log(`   ❌ ${u.email}: ${error.message}`);
    }
  } else {
    console.log(`   ✅ ${u.email}: criado com a mesma senha`);
  }
}

console.log('\n✅ Concluído. APAGUE o arquivo app/scripts/users.json agora (contém hashes).');
