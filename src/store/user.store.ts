'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserState {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: {
        id: 'me',
        name: 'Aria Blackwood',
        email: 'aria.blackwood@nexdash.io',
        avatar: 'https://ui-avatars.com/api/?name=Aria+Blackwood&background=6366F1&color=fff&size=128',
        role: 'admin',
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    { name: 'nexdash-user' }
  )
);
