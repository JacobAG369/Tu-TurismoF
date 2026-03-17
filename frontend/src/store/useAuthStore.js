import { create } from 'zustand';
import api from '../lib/axios';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setAuthSession: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data.data;

      get().setAuthSession(user, token);
      return { success: true };
    } catch (error) {
      get().setError(error.response?.data?.message || 'Error occurred during login');
      return { success: false, error: error.response?.data?.message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', userData);
      
      // Attempt login immediately after successful registration
      const loginResult = await get().login({
        email: userData.email,
        password: userData.password
      });

      if (!loginResult.success) {
        throw new Error(loginResult.error || 'Failed to auto-login after registration');
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error occurred during registration';

      set({ 
        isLoading: false, 
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Assuming a logout endpoint. We don't necessarily have to await it if we just clear local state.
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));
