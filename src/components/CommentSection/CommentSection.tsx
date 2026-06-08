import { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment } from '@/types';
import { formatDate } from '@/utils/storage';
import { usePostStore } from '@/store/postStore';
import { useUserStore } from '@/store/userStore';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const { currentUser } = useUserStore();
  const { addComment } = usePostStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="metal-card">
      <h3 className="text-lg font-medium text-white mb-6">
        评论 ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          {currentUser?.avatar && (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.nickname}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          )}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentUser ? '写下你的评论...' : '请先登录'}
              disabled={!currentUser || isSubmitting}
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={!content.trim() || !currentUser || isSubmitting}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-charcoal-500 py-8">暂无评论，快来抢沙发吧~</p>
        ) : (
          comments.map((comment, index) => (
            <div 
              key={comment.id} 
              className="flex gap-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img 
                src={comment.user.avatar} 
                alt={comment.user.nickname}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">
                    {comment.user.nickname}
                  </span>
                  {comment.user.role === 'moderator' && (
                    <span className="px-1.5 py-0.5 rounded bg-warning-orange-500/20 text-warning-orange-400 text-xs">
                      版主
                    </span>
                  )}
                  <span className="text-charcoal-500 text-xs">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-charcoal-300 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
