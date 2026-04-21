import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AdminLoginProps {
  onLogin?: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) { onLogin?.(); }
      else { setError(t({ pt: 'Email ou senha incorretos', en: 'Invalid email or password', es: 'Email o contraseña incorrectos' })); }
    } catch {
      setError(t({ pt: 'Erro ao fazer login. Tente novamente.', en: 'Error logging in. Please try again.', es: 'Error al iniciar sesión. Inténtalo de nuevo.' }));
    } finally { setIsLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#F5F5F7' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8 pt-4">
          <img 
            src="/LOGOQUEROMAIS_PRETA.svg" 
            alt="Quero Mais" 
            className="h-10 lg:h-12 w-auto mx-auto mb-3"
          />
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            {t({ pt: 'Painel Administrativo', en: 'Admin Panel', es: 'Panel Administrativo' })}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{ background: '#FFFFFF', border: '1px solid #E8E8ED', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: '#1A1A2E' }}>
            {t({ pt: 'Entrar na sua conta', en: 'Sign in to your account', es: 'Iniciar sesión' })}
          </h2>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>
                {t({ pt: 'Email', en: 'Email', es: 'Correo' })}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@queromais.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm md:text-base text-black rounded-xl outline-none transition-all"
                  style={{
                    background: '#F9FAFB',
                    border: '1px solid #E8E8ED',
                    color: '#1A1A2E',
                  }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = '#E91E8C'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(233,30,140,0.08)'; }}
                  onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>
                {t({ pt: 'Senha', en: 'Password', es: 'Contraseña' })}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 text-sm md:text-base text-black rounded-xl outline-none transition-all"
                  style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = '#E91E8C'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(233,30,140,0.08)'; }}
                  onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #E91E8C, #FF6BB5)',
                boxShadow: '0 4px 16px rgba(233,30,140,0.3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(233,30,140,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(233,30,140,0.3)'; }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t({ pt: 'Entrar', en: 'Sign in', es: 'Entrar' })}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
