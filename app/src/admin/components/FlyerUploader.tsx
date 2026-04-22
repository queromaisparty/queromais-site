/**
 * FlyerUploader.tsx
 * Tema Premium Light: Fundos claros, bordas sutis. Compressão via Canvas.
 */
import { useRef, useState } from 'react';
import { ImagePlus, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface FlyerUploaderProps {
  value: string;
  onChange: (value: string) => void;
}

type Stage = 'idle' | 'reading' | 'compressing' | 'done' | 'error';

async function compressImage(file: File, maxW = 1200, quality = 0.82): Promise<{ base64: string; originalKB: number; finalKB: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) { reject(new Error('Formato não suportado. Use JPG, PNG ou WebP.')); return; }
    if (file.size > 8 * 1024 * 1024) { reject(new Error('Imagem muito grande. Máximo 8MB.')); return; }

    const originalKB = Math.round(file.size / 1024);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas não suportado.')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/webp', quality);
        const finalKB = Math.round((base64.length * 3) / 4 / 1024);
        resolve({ base64, originalKB, finalKB });
      };
      img.onerror = () => reject(new Error('Erro ao processar imagem.'));
      img.src = e.target!.result as string;
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsDataURL(file);
  });
}

export function FlyerUploader({ value, onChange }: FlyerUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState<{ originalKB: number; finalKB: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = async (file: File) => {
    setStage('reading');
    setProgress(10);
    setInfo(null);
    setErrorMsg('');
    const tick = setInterval(() => setProgress(p => Math.min(p + 15, 80)), 80);
    try {
      setStage('compressing');
      const result = await compressImage(file);
      clearInterval(tick);
      setProgress(100);
      setInfo({ originalKB: result.originalKB, finalKB: result.finalKB });
      setStage('done');
      onChange(result.base64);
    } catch (err) {
      clearInterval(tick);
      setStage('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setStage('idle');
    setProgress(0);
    setInfo(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const pctSaved = info ? Math.round((1 - info.finalKB / info.originalKB) * 100) : 0;

  // ── Com imagem ────────────────────────────────────
  if (value && (stage === 'done' || stage === 'idle')) {
    return (
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Cartaz / Flyer Principal</label>
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <img src={value} alt="Flyer preview" className="w-full max-h-64 object-contain brightness-95 group-hover:brightness-105 transition-all" />
          
          {info && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm leading-none">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {info.originalKB}KB → {info.finalKB}KB ({pctSaved}% menor)
            </div>
          )}
          
          <div className="absolute top-3 right-3 flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 hover:text-admin-accent hover:border-admin-accent hover:bg-white shadow-sm transition-all"
              title="Trocar Imagem">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleRemove}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/90 backdrop-blur-sm text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm transition-all"
              title="Remover Imagem">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      </div>
    );
  }

  // ── Comprimindo ───────────────────────────────────
  if (stage === 'reading' || stage === 'compressing') {
    return (
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Cartaz / Flyer Principal</label>
        <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-4 shadow-sm">
          <p className="text-sm font-semibold text-admin-accent">
            {stage === 'reading' ? 'Processando imagem...' : 'Otimizando qualidade e peso...'}
          </p>
          <div className="w-full max-w-[200px] h-2 rounded-full overflow-hidden bg-slate-200">
            <div className="h-full rounded-full transition-all duration-300 ease-out bg-admin-accent" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">{progress}% concluído</p>
        </div>
      </div>
    );
  }

  // ── Erro ──────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Cartaz / Flyer Principal</label>
        <div className="p-5 rounded-xl flex items-start gap-3 bg-red-50 border border-red-200 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-bold text-red-600 mb-1">Falha ao processar o flyer</p>
            <p className="text-xs text-red-500 mb-2">{errorMsg}</p>
            <button type="button" onClick={() => { setStage('idle'); inputRef.current?.click(); }}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline transition-colors">
              Tentar novamente
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      </div>
    );
  }

  // ── Idle ──────────────────────────────────────────
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Cartaz / Flyer Principal
        <span className="ml-1 text-admin-accent normal-case font-medium">*</span>
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer transition-all hover:bg-slate-100 hover:border-admin-accent/50 group"
      >
        <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-admin-accent transition-colors" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700 mb-1">
            Arraste ou <span className="text-admin-accent">clique para selecionar</span>
          </p>
          <p className="text-xs text-slate-500">JPG, PNG ou WebP (máx. 8MB)</p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 shadow-sm">
             ⭐ Otimização automática
          </div>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
    </div>
  );
}
