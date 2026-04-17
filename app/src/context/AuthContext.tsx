import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AdminUser } from '@/types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'quero-mais-auth';
const USER_KEY = 'quero-mais-user';

// Credenciais padrão para demonstração
const DEFAULT_CREDENTIALS = {
  email: 'admin@queromais.com',
  password: 'admin123'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há sessão salva
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedAuth === 'true' && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulação de autenticação
    if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
      const userData: AdminUser = {
        id: '1',
        email: DEFAULT_CREDENTIALS.email,
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
