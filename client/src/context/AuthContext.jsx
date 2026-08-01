import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("studyvault_token"));
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // On mount, validate any existing token against the API
  useEffect(() => {
    (async () => {
      if (!token) { setAuthLoading(false); return; }
      try {
        const res = await authService.me();
        setUser(res.user);
      } catch (err) {
        localStorage.removeItem("studyvault_token");
        setToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    setAuthError("");
    const res = await authService.login({ email, password });
    localStorage.setItem("studyvault_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setAuthError("");
    const res = await authService.signup({ name, email, password });
    localStorage.setItem("studyvault_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    localStorage.removeItem("studyvault_token");
    setToken(null);
    setUser(null);
  }, []);

  const updateUserLocal = useCallback((patch) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, authLoading, authError, setAuthError, login, signup, logout, updateUserLocal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
