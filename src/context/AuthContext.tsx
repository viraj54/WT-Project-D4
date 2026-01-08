import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'citizen' | 'technician' | 'admin';

interface User {
  id: string;
  name: string;
  role: UserRole;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name?: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = 'user_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const login = async (role: UserRole, name?: string, password?: string) => {
    if (role === 'admin') {
      const resp = await fetch('http://localhost:4000/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password }),
      });
      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || 'Admin login failed');
      }
      const data = await resp.json();
      const newUser: User = { id: data.user.id, name: data.user.name, role: 'admin', token: data.token };
      setUser(newUser);
      return;
    }
    
    if (role === 'technician') {
      const resp = await fetch('http://localhost:4000/api/auth/technician/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || 'Technician login failed');
      }
      const data = await resp.json();
      const newUser: User = { id: data.user.id, name: data.user.name, role: 'technician', token: data.token };
      setUser(newUser);
      return;
    }
    
    if (role === 'citizen') {
      const resp = await fetch('http://localhost:4000/api/auth/citizen/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, governmentId: password }),
      });
      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || 'Citizen login failed');
      }
      const data = await resp.json();
      const newUser: User = { id: data.user.id, name: data.user.name, role: 'citizen', token: data.token };
      setUser(newUser);
      return;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
