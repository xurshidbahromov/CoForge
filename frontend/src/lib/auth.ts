import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

export interface User {
  id: number;
  username: string;
  email?: string;
  avatar_url?: string;
  stack?: string[];
  experienceLevel?: 'beginner' | 'junior' | 'confident_junior';
  goal?: 'experience' | 'portfolio' | 'job_prep';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: (user) => set({
        user,
        isAuthenticated: true,
        isLoading: false
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'coforge-auth',
    }
  )
);

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, setLoading, setUser, checkAuth } = useAuthStore();
  return { user, isAuthenticated, isLoading, login, logout, setLoading, setUser, checkAuth };
};

