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
      if (success) {
        onLogin?.();
      } else {
        setError(t({
          pt: 'Email ou senha incorretos',
          en: 'Invalid email or password',
          es: 'Email o contraseña incorrectos'
        }));
      }
    } catch {
      setError(t({
        pt: 'Erro ao fazer login. Tente novamente.',
        en: 'Error logging in. Please try again.',
        es: 'Error al iniciar sesión. Inténtalo de nuevo.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            QUERO <span className="text-[#CCFF00]">MAIS</span>
          </h1>
          <p className="text-white/50 mt-2">
            {t({ pt: 'Painel Administrativo', en: 'Admin Panel', es: 'Panel Administrativo' })}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-white text-xl font-bold mb-6 text-center">
            {t({ pt: 'Entrar', en: 'Login', es: 'Iniciar Sesión' })}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">
                {t({ pt: 'Email', en: 'Email', es: 'Correo' })}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors"
                  placeholder="admin@queromais.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                {t({ pt: 'Senha', en: 'Password', es: 'Contraseña' })}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {t({ pt: 'Entrar', en: 'Login', es: 'Entrar' })}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              {t({ 
                pt: 'Credenciais padrão: admin@queromais.com / admin123',
                en: 'Default credentials: admin@queromais.com / admin123',
                es: 'Credenciales por defecto: admin@queromais.com / admin123'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
