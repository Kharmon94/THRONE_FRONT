import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../../services/api";
import { canViewAdmin } from "../../utils/permissions";
import type { User } from "../../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function acceptAdminUser(user: User | null): User | null {
  if (!canViewAdmin(user)) {
    api.clearToken();
    return null;
  }
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      setUser(acceptAdminUser(u));
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.signIn(email, password);
      const admin = acceptAdminUser(data.user);
      if (!admin) return false;
      setUser(admin);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
