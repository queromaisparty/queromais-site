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
    // Bloqueia apenas arquivos muito grandes (> 3x o limite sugerido para processamento seguro via canvas)
    if (file.size > maxBytes * 4) {
      setError(`Imagem absurdamente grande. Máximo suportado é ${maxSizeMB * 4}MB para não travar o navegador. Suba uma versão menor.`);
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

        // Redimensionamento Inteligente
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

        // Qualidade adaptativa para respeitar limite sem estourar o banco
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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
          {aspectHint && <span className="text-slate-400 capitalize normal-case text-xs ml-1 font-medium">({aspectHint})</span>}
        </label>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden bg-slate-50
          ${isDragging ? 'border-admin-accent bg-pink-50' : 'border-slate-200 hover:border-admin-accent/50 hover:bg-slate-100'}
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
          <div className="relative group p-1">
            <img
              src={value}
              alt="Preview"
              className="w-full h-auto max-h-[300px] object-cover rounded-lg shadow-sm"
            />
            <div className="absolute inset-1 bg-slate-900/0 group-hover:bg-slate-900/40 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs font-bold leading-none uppercase tracking-wider bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm shadow-sm">
                Trocar Imagem
              </span>
            </div>
            {/* Botão remover */}
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 w-8 h-8 bg-white text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-md z-10"
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Estado vazio */}
        {!value && !isProcessing && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-700 text-sm font-bold mb-1">
              Arraste ou <span className="text-admin-accent">selecione uma foto</span>
            </p>
            <p className="text-slate-500 text-xs mt-1">
              JPG, PNG ou WebP (máx recomendado: {maxSizeMB}MB)
            </p>
            <div className="mt-4 px-3 py-1 rounded-full border border-slate-200 bg-white text-[10px] font-bold text-slate-400 shadow-sm uppercase tracking-wider">
               Redimensionamento Automático
            </div>
          </div>
        )}

        {/* Processando */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10 bg-slate-50 border-t border-slate-200 mt-[-2px]">
            <div className="w-8 h-8 border-2 border-admin-accent border-t-transparent rounded-full animate-spin mb-3 shadow-sm" />
            <p className="text-admin-accent text-sm font-bold">Ajustando qualidade...</p>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-xs font-medium">{error}</p>
        </div>
      )}

      {/* URL alternativa */}
      {!value && !isProcessing && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Ou cole uma URL externa da imagem..."
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all placeholder:text-slate-400"
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
          <div className="w-10 h-10 flex border border-slate-200 bg-slate-50 rounded-lg items-center justify-center text-slate-400 shrink-0 shadow-sm">
            <ImageIcon className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
