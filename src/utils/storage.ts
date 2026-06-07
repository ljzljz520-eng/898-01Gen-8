const STORAGE_KEYS = {
  POSTS: 'car_mod_posts',
  CURRENT_USER: 'car_mod_current_user',
  CARS: 'car_mod_cars',
  USERS: 'car_mod_users',
};

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

export const storage = {
  getPosts: <T>() => getStorageItem<T[]>(STORAGE_KEYS.POSTS, []),
  setPosts: <T>(posts: T[]) => setStorageItem(STORAGE_KEYS.POSTS, posts),
  getCurrentUser: <T>() => getStorageItem<T | null>(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: <T>(user: T) => setStorageItem(STORAGE_KEYS.CURRENT_USER, user),
  getCars: <T>() => getStorageItem<T[]>(STORAGE_KEYS.CARS, []),
  setCars: <T>(cars: T[]) => setStorageItem(STORAGE_KEYS.CARS, cars),
  getUsers: <T>() => getStorageItem<T[]>(STORAGE_KEYS.USERS, []),
  setUsers: <T>(users: T[]) => setStorageItem(STORAGE_KEYS.USERS, users),
  clearCurrentUser: () => removeStorageItem(STORAGE_KEYS.CURRENT_USER),
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
