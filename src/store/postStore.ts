import { create } from 'zustand';
import { Post, CreatePostData, Comment, CarModel, FilingStatus, SubmitSupplementData } from '@/types';
import { storage } from '@/utils/storage';
import { api } from '@/utils/api';
import { useUserStore } from './userStore';

interface PostState {
  posts: Post[];
  cars: CarModel[];
  loading: boolean;
  error: string | null;
  initData: () => Promise<void>;
  fetchPosts: (filters?: {
    modificationType?: string;
    filingStatus?: FilingStatus;
    search?: string;
    includeHidden?: boolean;
    userId?: string;
    status?: string;
    isFeatured?: boolean;
  }) => Promise<Post[]>;
  fetchPostById: (id: string) => Promise<Post | null>;
  addPost: (data: CreatePostData) => Promise<Post>;
  getPostById: (id: string) => Post | undefined;
  updatePost: (id: string, updates: Partial<Post>) => Promise<Post>;
  hidePost: (id: string, reason: string) => Promise<Post>;
  unhidePost: (id: string) => Promise<Post>;
  requireSupplement: (id: string, message: string) => Promise<Post>;
  submitSupplement: (data: SubmitSupplementData) => Promise<Post>;
  approvePost: (id: string) => Promise<Post>;
  markAsFeatured: (id: string) => Promise<Post>;
  unmarkAsFeatured: (id: string) => Promise<Post>;
  addComment: (postId: string, content: string) => Promise<Comment | null>;
  getFeaturedPostsByCar: (brand: string, model: string) => Promise<Post[]>;
  getCarsWithFeaturedCount: () => Promise<(CarModel & { featuredCount: number })[]>;
  refreshPosts: () => Promise<void>;
  getFilteredPosts: (filters: {
    modificationType?: string;
    filingStatus?: FilingStatus;
    search?: string;
    includeHidden?: boolean;
  }) => Post[];
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  cars: [],
  loading: false,
  error: null,
  
  initData: async () => {
    set({ loading: true, error: null });
    try {
      const [cars, posts] = await Promise.all([
        api.getCars(),
        api.getPosts({ includeHidden: true }),
      ]);
      set({ cars, posts, loading: false });
    } catch (error) {
      console.error('初始化数据失败:', error);
      const cars = storage.getCars<CarModel>();
      const posts = storage.getPosts<Post>();
      set({ cars, posts, loading: false });
    }
  },
  
  refreshPosts: async () => {
    try {
      const posts = await api.getPosts({ includeHidden: true });
      set({ posts });
    } catch (error) {
      console.error('刷新帖子失败:', error);
    }
  },
  
  fetchPosts: async (filters) => {
    try {
      const posts = await api.getPosts(filters);
      return posts;
    } catch (error) {
      console.error('获取帖子失败:', error);
      return [];
    }
  },
  
  fetchPostById: async (id: string) => {
    try {
      const post = await api.getPostById(id);
      set(state => ({
        posts: state.posts.map(p => p.id === id ? post : p),
      }));
      return post;
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      return null;
    }
  },
  
  addPost: async (data: CreatePostData) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser) throw new Error('请先登录');
    
    set({ loading: true, error: null });
    try {
      const newPost = await api.createPost({ ...data, userId: currentUser.id });
      set(state => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
      storage.setPosts([newPost, ...get().posts]);
      return newPost;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '发布失败', loading: false });
      throw error;
    }
  },
  
  getPostById: (id: string) => {
    return get().posts.find(p => p.id === id);
  },
  
  updatePost: async (id: string, updates: Partial<Post>) => {
    set({ loading: true, error: null });
    try {
      const updatedPost = await api.updatePost(id, updates);
      set(state => ({
        posts: state.posts.map(p => p.id === id ? updatedPost : p),
        loading: false,
      }));
      storage.setPosts(get().posts);
      return updatedPost;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '更新失败', loading: false });
      throw error;
    }
  },
  
  hidePost: async (id: string, reason: string) => {
    return await get().updatePost(id, { status: 'hidden', hiddenReason: reason });
  },
  
  unhidePost: async (id: string) => {
    return await get().updatePost(id, { status: 'published', hiddenReason: undefined });
  },
  
  requireSupplement: async (id: string, message: string) => {
    return await get().updatePost(id, { requireSupplement: message, status: 'hidden' });
  },
  
  submitSupplement: async (data: SubmitSupplementData) => {
    set({ loading: true, error: null });
    try {
      const updatedPost = await api.submitSupplement(data);
      set(state => ({
        posts: state.posts.map(p => p.id === data.postId ? updatedPost : p),
        loading: false,
      }));
      storage.setPosts(get().posts);
      return updatedPost;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '提交失败', loading: false });
      throw error;
    }
  },
  
  approvePost: async (id: string) => {
    return await get().updatePost(id, { status: 'published' });
  },
  
  markAsFeatured: async (id: string) => {
    return await get().updatePost(id, { isFeatured: true });
  },
  
  unmarkAsFeatured: async (id: string) => {
    return await get().updatePost(id, { isFeatured: false });
  },
  
  addComment: async (postId: string, content: string) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser) return null;
    
    try {
      const newComment = await api.addComment(postId, currentUser.id, content);
      set(state => ({
        posts: state.posts.map(p => 
          p.id === postId 
            ? { ...p, comments: [...p.comments, newComment], updatedAt: new Date().toISOString() }
            : p
        ),
      }));
      storage.setPosts(get().posts);
      return newComment;
    } catch (error) {
      console.error('评论失败:', error);
      return null;
    }
  },
  
  getFeaturedPostsByCar: async (brand: string, model: string) => {
    try {
      const posts = await api.getPosts({
        isFeatured: true,
        carBrand: brand,
        carModel: model,
        includeHidden: false,
      });
      return posts;
    } catch (error) {
      console.error('获取精品帖子失败:', error);
      return [];
    }
  },
  
  getCarsWithFeaturedCount: async () => {
    try {
      return await api.getCarsWithFeaturedCount();
    } catch (error) {
      console.error('获取车型统计失败:', error);
      return [];
    }
  },
  
  getFilteredPosts: ({ modificationType, filingStatus, search, includeHidden = false }) => {
    let posts = get().posts.filter(p => includeHidden || p.status !== 'hidden');
    
    if (modificationType && modificationType !== 'all') {
      posts = posts.filter(p => p.modificationType === modificationType);
    }
    
    if (filingStatus) {
      posts = posts.filter(p => p.filingStatus === filingStatus);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.content.toLowerCase().includes(searchLower) ||
        p.carModel.brand.toLowerCase().includes(searchLower) ||
        p.carModel.model.toLowerCase().includes(searchLower)
      );
    }
    
    return posts;
  },
}));
