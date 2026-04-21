import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { folderId } = await req.json();

    if (!folderId) {
      return new Response(JSON.stringify({ error: "folderId é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_DRIVE_API_KEY');

    if (!GOOGLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Chave da API do Google não configurada no Supabase" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Busca apenas arquivos de imagem dentro da pasta
    console.log(`Buscando no Google Drive a pasta: ${folderId}`);
    
    // ATENÇÃO: para buscar em pastas compartilhadas que não são do usuário dono da API KEY,
    // garantimos query em todos os drives
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)&key=${GOOGLE_API_KEY}&pageSize=500&supportsAllDrives=true&includeItemsFromAllDrives=true`;

    const driveRes = await fetch(url);
    if (!driveRes.ok) {
      const errText = await driveRes.text();
      console.error("Erro da Google API:", errText);
      return new Response(JSON.stringify({ error: "Não foi possível ler a pasta. Verifique se o link é público.", details: errText }), {
        status: driveRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await driveRes.json();
    return new Response(JSON.stringify({ files: data.files || [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função gdrive-sync:', error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
