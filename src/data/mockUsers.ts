import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    nickname: '改装达人小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    role: 'user',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-002',
    nickname: '老司机老李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    role: 'user',
    createdAt: '2024-02-20T14:20:00Z',
  },
  {
    id: 'user-003',
    nickname: '车迷小张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    role: 'user',
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'user-004',
    nickname: '版主-Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'moderator',
    createdAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'user-005',
    nickname: '改装师-阿杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jie',
    role: 'moderator',
    createdAt: '2023-08-15T10:00:00Z',
  },
];
