import { create } from 'zustand';
import { Post, CreatePostData, Comment, CarModel, FilingStatus } from '@/types';
import { storage, generateId } from '@/utils/storage';
import { mockPosts } from '@/data/mockPosts';
import { mockCars } from '@/data/mockCars';
import { useUserStore } from './userStore';

interface PostState {
  posts: Post[];
  cars: CarModel[];
  initData: () => void;
  addPost: (data: CreatePostData) => Post;
  getPostById: (id: string) => Post | undefined;
  updatePost: (id: string, updates: Partial<Post>) => void;
  hidePost: (id: string, reason: string) => void;
  unhidePost: (id: string) => void;
  requireSupplement: (id: string, message: string) => void;
  markAsFeatured: (id: string) => void;
  unmarkAsFeatured: (id: string) => void;
  addComment: (postId: string, content: string) => Comment | null;
  getFeaturedPostsByCar: (brand: string, model: string) => Post[];
  getCarsWithFeaturedCount: () => (CarModel & { featuredCount: number })[];
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
  
  initData: () => {
    let posts = storage.getPosts<Post>();
    if (posts.length === 0) {
      posts = mockPosts;
      storage.setPosts(posts);
    }
    
    let cars = storage.getCars<CarModel>();
    if (cars.length === 0) {
      cars = mockCars;
      storage.setCars(cars);
    }
    
    set({ posts, cars });
  },
  
  addPost: (data: CreatePostData) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser) throw new Error('请先登录');
    
    const car = get().cars.find(c => c.id === data.carModelId);
    if (!car) throw new Error('车型不存在');
    
    const newPost: Post = {
      id: generateId(),
      userId: currentUser.id,
      user: currentUser,
      title: data.title,
      content: data.content,
      images: data.images,
      modificationType: data.modificationType,
      carModel: car,
      filingStatus: data.filingStatus,
      cost: data.cost,
      inspectionImpact: data.inspectionImpact,
      status: 'published',
      isFeatured: false,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const posts = [newPost, ...get().posts];
    storage.setPosts(posts);
    set({ posts });
    return newPost;
  },
  
  getPostById: (id: string) => {
    return get().posts.find(p => p.id === id);
  },
  
  updatePost: (id: string, updates: Partial<Post>) => {
    const posts = get().posts.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    storage.setPosts(posts);
    set({ posts });
  },
  
  hidePost: (id: string, reason: string) => {
    get().updatePost(id, { status: 'hidden', hiddenReason: reason });
  },
  
  unhidePost: (id: string) => {
    get().updatePost(id, { status: 'published', hiddenReason: undefined });
  },
  
  requireSupplement: (id: string, message: string) => {
    get().updatePost(id, { requireSupplement: message, status: 'hidden' });
  },
  
  markAsFeatured: (id: string) => {
    get().updatePost(id, { isFeatured: true });
  },
  
  unmarkAsFeatured: (id: string) => {
    get().updatePost(id, { isFeatured: false });
  },
  
  addComment: (postId: string, content: string) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser) return null;
    
    const newComment: Comment = {
      id: generateId(),
      userId: currentUser.id,
      user: currentUser,
      content,
      createdAt: new Date().toISOString(),
    };
    
    const posts = get().posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    
    storage.setPosts(posts);
    set({ posts });
    return newComment;
  },
  
  getFeaturedPostsByCar: (brand: string, model: string) => {
    return get().posts.filter(
      p => p.isFeatured && 
           p.carModel.brand === brand && 
           p.carModel.model === model &&
           p.status !== 'hidden'
    );
  },
  
  getCarsWithFeaturedCount: () => {
    const { posts, cars } = get();
    return cars.map(car => {
      const featuredCount = posts.filter(
        p => p.isFeatured && 
             p.carModel.id === car.id &&
             p.status !== 'hidden'
      ).length;
      return { ...car, featuredCount };
    });
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
