import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { User } from "@/types/models";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user for demo
const MOCK_USER: User = {
  id: "USR-001",
  name: "Rizky Pratama",
  email: "rizky@email.com",
  phone: "081234567890",
  avatar: undefined,
  role: "passenger",
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = api.getToken();
    // Restore session if token exists
    return token ? MOCK_USER : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;
  const token = api.getToken();

  const login = useCallback(async (phone: string, _otp: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockToken = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      api.setToken(mockToken);
      setUser({ ...MOCK_USER, phone });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
