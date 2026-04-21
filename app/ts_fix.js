const fs = require('fs');
const path = require('path');
const appDir = 'C:\\Projetos\\QUEROMAISSITE\\app';

const fix = (file, replacements) => {
  const fullPath = path.join(appDir, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(fullPath, content);
};

fix('src/admin/components/AdminContact.tsx', [['Mail, ', '']]);
fix('src/admin/components/AdminFicaMais.tsx', [['Sparkles, ', '']]);
fix('src/admin/components/AdminMusic.tsx', [['Music, ', '']]);
fix('src/admin/components/AdminShop.tsx', [['ShoppingBag, ', '']]);
fix('src/admin/components/AdminSobre.tsx', [['Info, ', '']]);

fix('src/pages/EventosPage.tsx', [
  ['import { Filter } from', '// import { Filter } from'],
  ['const { t } = useLanguage();', ''],
  ['event.location.name', 'event.venue'],
  ['event.location.city', 'event.city'],
  ['event.location.address', 'event.address || \"\"']
]);
const evPath = path.join(appDir, 'src/pages/EventosPage.tsx');
let evContent = fs.readFileSync(evPath, 'utf8');
evContent = evContent.replace(/typeof event\.location === 'object' \? [^:]+ : event\.location/g, 'event.venue');
fs.writeFileSync(evPath, evContent);

fix('src/pages/FicaMaisPage.tsx', [
  ['dj.role === \\'residente\\'', 'dj.resident === true'],
  ['dj.imageUrl', 'dj.image'],
  ['typeof dj.name === \\'string\\' ? dj.name : dj.name.pt', 'dj.name'],
  ['dj.genre ||', ''],
  ['dj.soundcloudUrl', 'dj.socialLinks?.find(l => l.platform===\\'soundcloud\\')?.url'],
  ['dj.instagramUrl', 'dj.socialLinks?.find(l => l.platform===\\'instagram\\')?.url']
]);

fix('src/pages/MusicPage.tsx', [
  ['dj.soundcloudUrl', 'dj.socialLinks?.find(l=>l.platform===\\'soundcloud\\')?.url'],
  ['set.soundcloudUrl', 'set.externalLink'],
  ['playlist.spotifyUrl', 'playlist.externalUrl'],
  ['dj.imageUrl', 'dj.image'],
  ['typeof dj.name === \\'string\\' ? dj.name : dj.name.pt', 'dj.name'],
  ['dj.genre ||', '']
]);

fix('src/pages/VoceNaQMPage.tsx', [
  ['album.date', 'album.createdAt'],
  ['album.photos', 'album.images'],
  ['(photoUrl, idx)', '(photoUrl: any, idx: number)']
]);

fix('src/sections/VoceSection.tsx', [
  ['useMemo, ', ''],
  ['caption: string; }[] = [', 'caption: string; downloadAllowed: boolean; source: \\'upload\\'|\\'url\\'|\\'gdrive\\'; }[] = ['],
  ['caption: \\'Quero Mais Party\\' }', 'caption: \\'Quero Mais Party\\', downloadAllowed: false, source: \\'upload\\' }'],
  ['caption: \\'Fica Mais After\\' }', 'caption: \\'Fica Mais After\\', downloadAllowed: false, source: \\'upload\\' }'],
  ['caption: \\'Público\\' }', 'caption: \\'Público\\', downloadAllowed: false, source: \\'upload\\' }']
]);
console.log('Fixes applied');
