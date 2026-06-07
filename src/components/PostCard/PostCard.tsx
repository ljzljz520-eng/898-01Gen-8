import { Link } from 'react-router-dom';
import { CircleDot, Lightbulb, Gauge, Armchair, Star, Eye, MessageCircle, DollarSign } from 'lucide-react';
import { Post, MODIFICATION_TYPE_LABELS } from '@/types';
import { formatDate, formatCurrency } from '@/utils/storage';
import { FilingBadge, InspectionBadge } from '../ComplianceBadge';

const typeIcons = {
  wheel: CircleDot,
  light: Lightbulb,
  suspension: Gauge,
  interior: Armchair,
};

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const TypeIcon = typeIcons[post.modificationType];
  const isHidden = post.status === 'hidden';

  return (
    <Link 
      to={`/post/${post.id}`}
      className={`metal-card group block opacity-0 animate-fade-in-up ${
        isHidden ? 'opacity-60' : ''
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {post.isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            精品
          </span>
        </div>
      )}

      {isHidden && (
        <div className="absolute inset-0 z-20 bg-charcoal-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Eye className="w-8 h-8 text-charcoal-500 mx-auto mb-2" />
            <p className="text-charcoal-400 text-sm">内容已被隐藏</p>
            {post.hiddenReason && (
              <p className="text-charcoal-500 text-xs mt-1 max-w-xs px-4">{post.hiddenReason}</p>
            )}
          </div>
        </div>
      )}

      <div className="relative aspect-video overflow-hidden rounded-lg mb-4 bg-charcoal-800">
        {post.images[0] ? (
          <img 
            src={post.images[0]} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-charcoal-700 to-charcoal-800">
            <TypeIcon className="w-12 h-12 text-charcoal-500" />
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-sm text-white text-xs">
            <TypeIcon className="w-3 h-3" />
            {MODIFICATION_TYPE_LABELS[post.modificationType]}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-white line-clamp-2 group-hover:text-metal-blue-400 transition-colors">
          {post.title}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-charcoal-300">
            {post.carModel.brand} {post.carModel.model}
          </span>
          <span className="text-charcoal-600">·</span>
          <FilingBadge status={post.filingStatus} />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <InspectionBadge impact={post.inspectionImpact} />
          <span className="inline-flex items-center gap-1 text-sm text-charcoal-400">
            <DollarSign className="w-4 h-4" />
            {formatCurrency(post.cost)}
          </span>
        </div>

        <div className="pt-3 border-t border-charcoal-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={post.user.avatar} 
              alt={post.user.nickname}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-charcoal-400">{post.user.nickname}</span>
          </div>
          <div className="flex items-center gap-3 text-charcoal-500 text-sm">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments.length}
            </span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
