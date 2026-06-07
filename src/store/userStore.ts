import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { storage, generateId } from '@/utils/storage';
import { mockUsers } from '@/data/mockUsers';

interface UserState {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  initUsers: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: storage.getCurrentUser<User>(),
  users: [],
  
  setCurrentUser: (user: User) => {
    storage.setCurrentUser(user);
    set({ currentUser: user });
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
  
  initUsers: () => {
    let users = storage.getUsers<User>();
    if (users.length === 0) {
      users = mockUsers;
      storage.setUsers(users);
    }
    
    let currentUser = storage.getCurrentUser<User>();
    if (!currentUser) {
      currentUser = mockUsers[0];
      storage.setCurrentUser(currentUser);
    }
    
    set({ users, currentUser });
  },
}));
