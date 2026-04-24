/**
 * imageProcessor.ts
 * Utilitário central de compressão de imagens via Canvas API.
 * Suporta WebP, preserva proporção e aceita fundo transparente.
 */

interface OptimizeOptions {
  maxWidth?: number;
  quality?: number; // 0.0 a 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Converte um File (imagem) para uma versão otimizada (por padrão, WebP)
 * e retorna um novo objeto File pronto para upload.
 */
export async function optimizeImage(file: File, options: OptimizeOptions = {}): Promise<File> {
  const { maxWidth = 1600, quality = 0.82, format = 'image/webp' } = options;

  return new Promise((resolve, reject) => {
    // Se não for imagem suportada pelo Canvas para compressão, retorna a original
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcula proporção se for maior que o máximo permitido
        if (width > maxWidth) {
          const scale = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas não suportado pelo navegador.'));
        }

        // Desenha imagem com redimensionamento nativo suave
        ctx.drawImage(img, 0, 0, width, height);

        // Exporta do Canvas para Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Falha ao exportar blob do canvas.'));
            }

            // Descobre extensão do formato de saída
            const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png';
            
            // Retira a extensão antiga do nome e coloca a nova
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${baseName}_optimized.${ext}`;

            // Transforma Blob num File manipulável
            const optimizedFile = new File([blob], newFileName, {
              type: format,
              lastModified: Date.now(),
            });

            // Fallback: se por algum motivo a versão "otimizada" ficou mais pesada, devolvemos a original 
            // (muito comum se era um PNG de 50KB que virou um JPEG de 100KB)
            if (optimizedFile.size > file.size && file.type === format) {
              resolve(file);
            } else {
              resolve(optimizedFile);
            }
          },
          format,
          quality
        );
      };
      img.onerror = () => reject(new Error('Erro ao processar imagem fonte.'));
      img.src = e.target!.result as string;
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo fonte.'));
    reader.readAsDataURL(file);
  });
}
