import { useState } from 'react';
import api from '../services/api';
import { AuthContext } from './authContextState';

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem('userInfo');
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const hasValidJwt = parsed?.token && typeof parsed.token === 'string' && parsed.token.split('.').length === 3;
    const hasBasicProfile = parsed?._id && parsed?.email;

    if (hasValidJwt || hasBasicProfile) {
      return parsed;
    }
  } catch {
    window.localStorage.removeItem('userInfo');
  }

  window.localStorage.removeItem('userInfo');
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading] = useState(false);

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

  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put('/auth/profile', updates);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Update failed. Please try again.',
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { data } = await api.put('/auth/password', { currentPassword, newPassword });
      return { success: true, message: data?.message || 'Password updated successfully.' };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Password update failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, updateProfile, changePassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );

};
