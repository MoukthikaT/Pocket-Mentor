import { createContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pocketMentorToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('pocketMentorStudyHistory');
    localStorage.removeItem('pocketMentorChallenges');
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('pocketMentorToken');
        delete api.defaults.headers.common.Authorization;
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('pocketMentorToken', authToken);
    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('pocketMentorToken');
    delete api.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
