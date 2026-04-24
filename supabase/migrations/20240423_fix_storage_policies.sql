-- Cria o bucket se nao existir
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Deleta policies antigas caso existam pra evitar erro
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Enable public access for site-images" on storage.objects;
drop policy if exists "Enable upload for site-images" on storage.objects;
drop policy if exists "Enable delete for site-images" on storage.objects;
drop policy if exists "Enable update for site-images" on storage.objects;

-- Cria policy de acesso publico para SELECT
create policy "Enable public access for site-images"
on storage.objects for select
using (bucket_id = 'site-images');

-- Cria policy de INSERT liberado
create policy "Enable upload for site-images"
on storage.objects for insert
with check (bucket_id = 'site-images');

-- Cria policy de UPDATE liberado
create policy "Enable update for site-images"
on storage.objects for update
using (bucket_id = 'site-images');

-- Cria policy de DELETE liberado
create policy "Enable delete for site-images"
on storage.objects for delete
using (bucket_id = 'site-images');
