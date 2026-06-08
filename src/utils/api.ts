import { Post, User, CarModel, Comment, CreatePostData, SubmitSupplementData } from '@/types';

const API_BASE_URL = '/api';

const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API 请求失败 [${url}]:`, error);
    throw error;
  }
};

export const api = {
  health: () => request<{ status: string; timestamp: string }>('/health'),

  getUsers: () => request<User[]>('/users'),

  getUser: (id: string) => request<User>(`/users/${id}`),

  login: (userId: string) => request<User>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),

  getCars: () => request<CarModel[]>('/cars'),

  getCarsWithFeaturedCount: () => request<(CarModel & { featuredCount: number })[]>('/cars/featured'),

  getPosts: (params?: {
    modificationType?: string;
    filingStatus?: string;
    search?: string;
    includeHidden?: boolean;
    userId?: string;
    status?: string;
    isFeatured?: boolean;
    carBrand?: string;
    carModel?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return request<Post[]>(`/posts${queryString ? `?${queryString}` : ''}`);
  },

  getPostById: (id: string) => request<Post>(`/posts/${id}`),

  createPost: (data: CreatePostData & { userId: string }) => request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updatePost: (id: string, data: Partial<Post>) => request<Post>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  submitSupplement: (data: SubmitSupplementData) => request<Post>(`/posts/${data.postId}`, {
    method: 'PUT',
    body: JSON.stringify({
      supplementalContent: data.supplementalContent,
      supplementalImages: data.supplementalImages,
    }),
  }),

  addComment: (postId: string, userId: string, content: string) => request<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ userId, content }),
  }),
};
