import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CircleDot, 
  Lightbulb, 
  Gauge, 
  Armchair, 
  Star,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Image
} from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { useUserStore } from '@/store/userStore';
import { MODIFICATION_TYPE_LABELS, Post } from '@/types';
import { formatDate, formatCurrency } from '@/utils/storage';
import { FilingBadge, InspectionBadge } from '@/components/ComplianceBadge';
import CommentSection from '@/components/CommentSection';
import ModeratorPanel from '@/components/ModeratorPanel';

const typeIcons = {
  wheel: CircleDot,
  light: Lightbulb,
  suspension: Gauge,
  interior: Armchair,
};

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, fetchPostById } = usePostStore();
  const { currentUser } = useUserStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const post = getPostById(id || '');

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchPostById(id).finally(() => setLoading(false));
    }
  }, [id, fetchPostById]);

  if (loading && !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-800" />
          <div className="h-8 w-48 mx-auto mb-2 bg-charcoal-800 rounded" />
          <div className="h-4 w-64 mx-auto bg-charcoal-800 rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-800 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-charcoal-600" />
        </div>
        <h2 className="text-2xl font-medium text-white mb-2">帖子不存在</h2>
        <p className="text-charcoal-400 mb-6">该帖子可能已被删除或不存在</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          返回首页
        </button>
      </div>
    );
  }

  const TypeIcon = typeIcons[post.modificationType];
  const isHidden = post.status === 'hidden';
  const canViewHidden = currentUser?.role === 'moderator' || post.userId === currentUser?.id;

  if (isHidden && !canViewHidden) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="metal-card max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <EyeOff className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">内容已被隐藏</h2>
          {post.hiddenReason && (
            <p className="text-charcoal-400 mb-6">{post.hiddenReason}</p>
          )}
          <button onClick={() => navigate('/')} className="btn-primary">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <div className="container mx-auto px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-charcoal-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      {isHidden && (
        <div className="metal-card border-red-500/30 bg-red-500/5 mb-6">
          <div className="flex items-center gap-3">
            <EyeOff className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">该帖子已被隐藏</p>
              {post.hiddenReason && (
                <p className="text-charcoal-400 text-sm mt-1">{post.hiddenReason}</p>
              )}
              {post.requireSupplement && (
                <p className="text-warning-orange-400 text-sm mt-2">
                  <span className="font-medium">补充要求：</span>{post.requireSupplement}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="metal-card">
            {post.images.length > 0 && (
              <div className="relative aspect-video overflow-hidden rounded-lg mb-6 bg-charcoal-800 group">
                <img 
                  src={post.images[currentImageIndex]} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-800 text-charcoal-300 text-sm">
                <TypeIcon className="w-4 h-4" />
                {MODIFICATION_TYPE_LABELS[post.modificationType]}
              </span>
              <FilingBadge status={post.filingStatus} />
              {post.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  精品案例
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-charcoal-700/50">
              <Link to={`/profile`} className="flex items-center gap-3">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.nickname}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{post.user.nickname}</span>
                    {post.user.role === 'moderator' && (
                      <span className="px-1.5 py-0.5 rounded bg-warning-orange-500/20 text-warning-orange-400 text-xs">
                        版主
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-charcoal-500">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </Link>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-charcoal-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            {post.supplements && post.supplements.length > 0 && (
              <div className="border-t border-charcoal-700/50 pt-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  补充资料
                </h3>
                <div className="space-y-4">
                  {post.supplements.map((supplement, index) => (
                    <div key={supplement.id} className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                          第 {index + 1} 次补充
                        </span>
                        <span className="text-charcoal-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(supplement.createdAt)}
                        </span>
                      </div>
                      {supplement.content && (
                        <div className="text-charcoal-300 text-sm mb-3 whitespace-pre-wrap">
                          {supplement.content}
                        </div>
                      )}
                      {supplement.images && supplement.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {supplement.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="aspect-square rounded overflow-hidden bg-charcoal-800">
                              <img src={img} alt={`补充图片 ${imgIndex + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CommentSection postId={post.id} comments={post.comments} />
        </div>

        <div className="space-y-6">
          <ModeratorPanel
            postId={post.id}
            isHidden={isHidden}
            isFeatured={post.isFeatured}
            status={post.status}
            hiddenReason={post.hiddenReason}
            requireSupplement={post.requireSupplement}
          />

          <div className="metal-card">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning-orange-400" />
              合规信息
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">车型</span>
                <Link
                  to={`/index/${encodeURIComponent(post.carModel.brand)}/${encodeURIComponent(post.carModel.model)}`}
                  className="text-white font-medium hover:text-metal-blue-400 transition-colors"
                >
                  {post.carModel.brand} {post.carModel.model}
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">备案状态</span>
                <FilingBadge status={post.filingStatus} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  改装费用
                </span>
                <span className="text-white font-medium">{formatCurrency(post.cost)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">年检影响</span>
                <InspectionBadge impact={post.inspectionImpact} />
              </div>
            </div>
          </div>

          <div className="metal-card border-metal-blue-500/30">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-metal-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">查看同车型案例</h4>
                <p className="text-charcoal-400 text-sm mb-3">
                  更多 {post.carModel.brand} {post.carModel.model} 的精品改装案例
                </p>
                <Link
                  to={`/index/${encodeURIComponent(post.carModel.brand)}/${encodeURIComponent(post.carModel.model)}`}
                  className="btn-outline w-full justify-center text-sm py-2"
                >
                  浏览 {post.carModel.model} 案例
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
