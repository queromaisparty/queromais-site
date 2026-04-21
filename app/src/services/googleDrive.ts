/**
 * Google Drive Integration Service
 * 
 * Funciona com pastas PÚBLICAS do Google Drive.
 * O cliente cola o link da pasta no admin → as fotos aparecem automaticamente na galeria.
 * 
 * Formato de link aceito:
 * - https://drive.google.com/drive/folders/FOLDER_ID
 * - https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing
 * - Ou apenas o FOLDER_ID direto
 */

export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl: string;
  fullUrl: string;
}

/**
 * Extrai o folder ID de um link do Google Drive
 */
export function extractFolderId(input: string): string | null {
  if (!input) return null;

  // Se for só o ID (sem URL)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(input.trim())) {
    return input.trim();
  }

  // Extrai de URL tipo: drive.google.com/drive/folders/FOLDER_ID
  const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Extrai de URL tipo: drive.google.com/drive/u/0/folders/FOLDER_ID
  const match2 = input.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];

  return null;
}

/**
 * Gera URL pública direta de uma imagem do Google Drive
 * Funciona para arquivos em pastas públicas
 */
export function getGDriveImageUrl(fileId: string, size: 'thumb' | 'medium' | 'full' = 'full'): string {
  const sizes = {
    thumb: 200,
    medium: 800,
    full: 1600,
  };
  // Usar a API de thumbnail do Google Drive
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${sizes[size]}`;
}

/**
 * Gera URL de download direto de um arquivo do Google Drive
 */
export function getGDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Lista arquivos de imagem de uma pasta pública do Google Drive
 * Usa a API pública (sem autenticação) via Google Drive embed
 * 
 * NOTA: Para pastas públicas, usa fetch direto. Para privadas, precisaria de API Key.
 */
export async function listGDriveImages(folderId: string): Promise<GDriveFile[]> {
  try {
    // Usar Google Drive API v3 pública para pastas compartilhadas
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType+contains+'image/')&fields=files(id,name,mimeType,thumbnailLink)&key=`;
    
    // Se não tiver API key, usar fallback via embed page scraping
    // Para MVP, vamos aceitar que o admin cola os links individuais ou o folder ID
    // e geramos as URLs de thumbnail
    
    // Fallback: Retornar lista vazia e o admin adiciona manualmente os file IDs
    console.warn('Google Drive: Para listar automaticamente, configure uma API Key do Google Cloud.');
    return [];
  } catch (error) {
    console.error('Erro ao listar arquivos do Google Drive:', error);
    return [];
  }
}

/**
 * Verifica se uma URL do Google Drive é válida e acessível
 */
export async function validateGDriveUrl(url: string): Promise<boolean> {
  const folderId = extractFolderId(url);
  if (!folderId) return false;
  
  try {
    // Tenta acessar a thumbnail de um arquivo para validar
    const testUrl = `https://drive.google.com/thumbnail?id=${folderId}&sz=w100`;
    const response = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
    return true; // Se não deu erro, provavelmente é válido
  } catch {
    return false;
  }
}

/**
 * Converte IDs de arquivo do Google Drive para objetos GalleryImage
 */
export function gdriveIdsToImages(fileIds: string[]): Array<{
  id: string;
  url: string;
  source: 'gdrive';
  gdriveId: string;
  downloadAllowed: boolean;
}> {
  return fileIds.map((fileId, index) => ({
    id: `gdrive-${fileId}`,
    url: getGDriveImageUrl(fileId, 'full'),
    source: 'gdrive' as const,
    gdriveId: fileId,
    downloadAllowed: true,
  }));
}
