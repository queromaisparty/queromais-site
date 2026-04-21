import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (base64: string) => void;
  onClear?: () => void;
  label?: string;
  maxSizeMB?: number;
  aspectHint?: string; // Ex: "16:9 recomendado"
  className?: string;
}

const MAX_DIMENSION = 1400;
const DEFAULT_MAX_MB = 2;

export function ImageUploader({
  value,
  onChange,
  onClear,
  label = 'Imagem',
  maxSizeMB = DEFAULT_MAX_MB,
  aspectHint,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Arquivo inválido. Selecione uma imagem (JPG, PNG, WEBP).');
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes * 3) {
      // Bloqueia apenas arquivos muito grandes (> 3x o limite)
      setError(`Imagem muito grande. Máximo recomendado: ${maxSizeMB}MB. Sua imagem: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Redimensionar se necessário
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height / width) * MAX_DIMENSION);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width / height) * MAX_DIMENSION);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Qualidade adaptativa
        const quality = file.size > 1024 * 1024 ? 0.75 : 0.85;
        const compressed = canvas.toDataURL('image/jpeg', quality);
        onChange(compressed);
        setIsProcessing(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);
  const handleClick = () => inputRef.current?.click();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    onClear?.();
    setError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-white/70 text-sm font-medium block">
          {label}
          {aspectHint && <span className="text-white/30 text-xs ml-2">({aspectHint})</span>}
        </label>
      )}

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden
          ${isDragging ? 'border-[#E91E8C] bg-[#E91E8C]/5' : 'border-white/15 hover:border-white/30 bg-white/3'}
          ${value ? 'min-h-[160px]' : 'min-h-[120px]'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preview */}
        {value && (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-auto max-h-[300px] object-cover block"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                Trocar imagem
              </span>
            </div>
            {/* Botão remover */}
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remover imagem"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Estado vazio */}
        {!value && !isProcessing && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-white/60 text-sm font-medium">
              Clique ou arraste uma imagem aqui
            </p>
            <p className="text-white/30 text-xs mt-1">
              JPG, PNG, WEBP — máx. {maxSizeMB}MB recomendado
            </p>
          </div>
        )}

        {/* Processando */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#E91E8C] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-white/60 text-sm">Processando...</p>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* URL alternativa */}
      {!value && !isProcessing && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Ou cole uma URL de imagem..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-[#E91E8C]/50"
            onBlur={(e) => {
              const url = e.target.value.trim();
              if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                onChange(url);
                e.target.value = '';
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const url = (e.target as HTMLInputElement).value.trim();
                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                  onChange(url);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <div className="w-9 h-9 flex items-center justify-center text-white/30">
            <ImageIcon className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
