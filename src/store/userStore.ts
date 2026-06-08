import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { storage } from '@/utils/storage';
import { api } from '@/utils/api';

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  setCurrentUser: (user: User) => void;
  login: (userId: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  initUsers: () => Promise<void>;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: storage.getCurrentUser<User>(),
  users: [],
  loading: false,
  error: null,
  
  setCurrentUser: (user: User) => {
    storage.setCurrentUser(user);
    set({ currentUser: user });
  },
  
  login: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const user = await api.login(userId);
      storage.setCurrentUser(user);
      set({ currentUser: user, loading: false });
      return user;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '登录失败', loading: false });
      throw error;
    }
  },
  
  logout: () => {
    storage.clearCurrentUser();
    set({ currentUser: null });
  },
  
  switchRole: (role: UserRole) => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    const updatedUser: User = {
      ...currentUser,
      role,
    };
    storage.setCurrentUser(updatedUser);
    set({ currentUser: updatedUser });
  },
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await api.getUsers();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载用户失败', loading: false });
    }
  },
  
  initUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await api.getUsers();
      set({ users });
      
      let currentUser = storage.getCurrentUser<User>();
      if (!currentUser && users.length > 0) {
        currentUser = users[0];
        storage.setCurrentUser(currentUser);
        set({ currentUser });
      }
      
      set({ loading: false });
    } catch (error) {
      console.error('初始化用户失败，使用本地存储:', error);
      let users = storage.getUsers<User>();
      if (users.length === 0) {
        users = [];
      }
      
      let currentUser = storage.getCurrentUser<User>();
      set({ users, currentUser, loading: false });
    }
  },
}));
