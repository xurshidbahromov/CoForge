import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  githubUsername?: string;
  stack: string[];
  experienceLevel: 'beginner' | 'junior' | 'confident_junior';
  goal: 'experience' | 'portfolio' | 'job_prep';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
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
    }),
    {
      name: 'coforge-auth',
    }
  )
);

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, setLoading, setUser } = useAuthStore();
  return { user, isAuthenticated, isLoading, login, logout, setLoading, setUser };
};

