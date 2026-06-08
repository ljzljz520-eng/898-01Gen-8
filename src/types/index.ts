export type ModificationType = 'wheel' | 'light' | 'suspension' | 'interior';

export type FilingStatus = 'filed' | 'pending' | 'not_filed';

export type InspectionImpact = 'no_impact' | 'need_restore' | 'may_fail';

export type PostStatus = 'published' | 'hidden' | 'featured' | 'pending_review';

export type UserRole = 'user' | 'moderator';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
}

export interface CarModel {
  id: string;
  brand: string;
  model: string;
  year: string;
  brandInitial: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Supplement {
  id: string;
  content: string;
  images: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  title: string;
  content: string;
  images: string[];
  modificationType: ModificationType;
  carModel: CarModel;
  carModelId?: string;
  filingStatus: FilingStatus;
  cost: number;
  inspectionImpact: InspectionImpact;
  status: PostStatus;
  isFeatured: boolean;
  hiddenReason?: string;
  requireSupplement?: string;
  supplements?: Supplement[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitSupplementData {
  postId: string;
  supplementalContent: string;
  supplementalImages: string[];
}

export interface CreatePostData {
  title: string;
  content: string;
  images: string[];
  modificationType: ModificationType;
  carModelId: string;
  filingStatus: FilingStatus;
  cost: number;
  inspectionImpact: InspectionImpact;
}

export const MODIFICATION_TYPE_LABELS: Record<ModificationType, string> = {
  wheel: '轮毂',
  light: '灯光',
  suspension: '避震',
  interior: '内饰',
};

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  filed: '已备案',
  pending: '备案中',
  not_filed: '未备案',
};

export const INSPECTION_IMPACT_LABELS: Record<InspectionImpact, string> = {
  no_impact: '不影响',
  need_restore: '需恢复',
  may_fail: '可能不通过',
};

export const MODIFICATION_TYPE_ICONS: Record<ModificationType, string> = {
  wheel: 'CircleDot',
  light: 'Lightbulb',
  suspension: 'Gauge',
  interior: 'Armchair',
};
