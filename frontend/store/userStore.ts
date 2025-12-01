import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  subscription_tier: string;
  language: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: async (user) => {
    set({ user, isAuthenticated: true });
    await AsyncStorage.setItem('nova_user', JSON.stringify(user));
  },
  
  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await AsyncStorage.removeItem('nova_user');
  },
  
  loadUser: async () => {
    const userData = await AsyncStorage.getItem('nova_user');
    if (userData) {
      const user = JSON.parse(userData);
      set({ user, isAuthenticated: true });
    }
  },
}));
