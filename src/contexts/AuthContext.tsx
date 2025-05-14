import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Authentication context for DEMO mode — completely client-side.
 * Credentials are validated against a hard-coded list; there is **no** backend call.
 */

// -----------------------------------------------------------------------------
// Demo credentials (extend/remove as necessary for the presentation)
// -----------------------------------------------------------------------------
const DEMO_USERS = [
  { email: 'doctor@medassyst.ru', password: 'doctor123', role: 'doctor' },
  { email: 'patient@medassyst.ru', password: 'patient123', role: 'patient' },
  { email: 'admin@medassyst.ru', password: 'admin123', role: 'admin' },
  { email: 'demo@medassyst.ru', password: 'demo123', role: 'demo' },
  { email: 'admin123@gmail.com', password: 'admin123', role: 'admin' },
] as const;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type DemoUser = {
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: DemoUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// -----------------------------------------------------------------------------
// Context initialisation
// -----------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// LocalStorage keys
const STORAGE_USER_KEY = 'medassystUser';
const STORAGE_TOKEN_KEY = 'medassystToken';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. On mount — restore session (if any)
  useEffect(() => {
    // Force logout for testing welcome page flow
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    setToken(null);
    
    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  // 2. Fake login — validate email/password against DEMO_USERS list
  const login = async (email: string, password: string): Promise<boolean> => {
    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );

    if (!match) return false;

    const fakeToken = 'demo-token';
    // Derive basic name fields from email for avatar display
    const usernamePart = match.email.split('@')[0];
    const [firstNameRaw = '', lastNameRaw = ''] = usernamePart.split('.');
    const userData: DemoUser = {
      email: match.email,
      role: match.role,
      first_name: firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1),
      last_name: lastNameRaw.charAt(0).toUpperCase() + lastNameRaw.slice(1),
    };

    setUser(userData);
    setToken(fakeToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(STORAGE_TOKEN_KEY, fakeToken);

    return true;
  };

  // 3. Logout — clear state & storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
