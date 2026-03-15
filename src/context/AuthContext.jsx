import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLikelyJwt = (token) => typeof token === 'string' && token.split('.').length === 3;

  useEffect(() => {
    // Check local storage for token on mount and discard malformed legacy tokens
    const raw = localStorage.getItem('userInfo');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.token && isLikelyJwt(parsed.token)) {
          setUser(parsed);
        } else {
          localStorage.removeItem('userInfo');
        }
      } catch {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (name, email, password, college, targetRole) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, college, targetRole });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
