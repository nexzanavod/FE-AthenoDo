import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out

  useEffect(() => {
    if (!api.getToken()) { setUser(null); return; }
    api.me()
      .then(setUser)
      .catch(() => { api.clearToken(); setUser(null); });
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    api.saveToken(data.access_token);
    setUser(data.user);
  };

  const signup = async (email, password) => {
    const data = await api.signup(email, password);
    api.saveToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    await api.logout().catch(() => {});
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
