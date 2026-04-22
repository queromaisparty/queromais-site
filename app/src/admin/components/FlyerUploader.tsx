/**
 * FlyerUploader.tsx — Tema branco + magenta
 * Compressão automática via Canvas API. Zero dependências externas.
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
        <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Flyer do evento</label>
        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid #E8E8ED' }}>
          <img src={value} alt="Flyer preview" className="w-full max-h-56 object-contain" style={{ background: '#F9FAFB' }} />
          {info && (
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#D1FAE5', color: '#059669' }}>
              <CheckCircle2 className="w-3 h-3" />
              {info.originalKB}KB → {info.finalKB}KB ({pctSaved}% menor)
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="p-1.5 rounded-lg transition-all text-xs"
              style={{ background: 'rgba(255,255,255,0.9)', color: '#374151', border: '1px solid #E8E8ED' }}
              title="Substituir">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={handleRemove}
              className="p-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.9)', color: '#EF4444', border: '1px solid #FECACA' }}
              title="Remover">
              <X className="w-3.5 h-3.5" />
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
        <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Flyer do evento</label>
        <div className="p-6 rounded-xl space-y-3" style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}>
          <p className="text-sm text-center" style={{ color: '#9CA3AF' }}>
            {stage === 'reading' ? 'Lendo imagem...' : 'Comprimindo...'}
          </p>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E8E8ED' }}>
            <div className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #E91E8C, #FF6BB5)' }} />
          </div>
          <p className="text-xs text-center" style={{ color: '#D1D5DB' }}>{progress}%</p>
        </div>
      </div>
    );
  }

  // ── Erro ──────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Flyer do evento</label>
        <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <div>
            <p className="text-sm" style={{ color: '#DC2626' }}>{errorMsg}</p>
            <button type="button" onClick={() => { setStage('idle'); inputRef.current?.click(); }}
              className="text-xs mt-1 underline transition-colors" style={{ color: '#9CA3AF' }}>
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
      <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Flyer do evento</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer transition-all"
        style={{ border: '2px dashed #E8E8ED', background: '#F9FAFB' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#F9A8D4';
          (e.currentTarget as HTMLElement).style.background = '#FDF2F8';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#E8E8ED';
          (e.currentTarget as HTMLElement).style.background = '#F9FAFB';
        }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FCE7F3' }}>
          <ImagePlus className="w-6 h-6" style={{ color: '#E91E8C' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#374151' }}>
            Arraste ou <span style={{ color: '#E91E8C' }}>clique para enviar</span>
          </p>
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>JPG · PNG · WebP · max 8MB</p>
          <p className="text-xs" style={{ color: '#D1D5DB' }}>Comprimido automaticamente</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
    </div>
  );
}
