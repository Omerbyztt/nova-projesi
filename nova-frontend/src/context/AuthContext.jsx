import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await axiosInstance.get('/employees/me');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      setCurrentUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    fetchMe();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, refreshUser: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
