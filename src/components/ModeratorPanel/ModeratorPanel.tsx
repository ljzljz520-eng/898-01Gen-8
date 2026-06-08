import { useState } from 'react';
import { Eye, EyeOff, Star, FileText, AlertTriangle, X, Check, Clock } from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { useUserStore } from '@/store/userStore';

interface ModeratorPanelProps {
  postId: string;
  isHidden: boolean;
  isFeatured: boolean;
  status: string;
  hiddenReason?: string;
  requireSupplement?: string;
}

export default function ModeratorPanel({ 
  postId, 
  isHidden, 
  isFeatured,
  status,
  hiddenReason,
  requireSupplement 
}: ModeratorPanelProps) {
  const { currentUser } = useUserStore();
  const { hidePost, unhidePost, markAsFeatured, unmarkAsFeatured, requireSupplement: requestSupplement, approvePost } = usePostStore();
  
  const [showHideModal, setShowHideModal] = useState(false);
  const [showSupplementModal, setShowSupplementModal] = useState(false);
  const [hideReason, setHideReason] = useState('');
  const [supplementMessage, setSupplementMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser || currentUser.role !== 'moderator') {
    return null;
  }

  const handleHide = async () => {
    if (!hideReason.trim()) {
      alert('请输入隐藏原因');
      return;
    }
    setIsLoading(true);
    try {
      await hidePost(postId, hideReason.trim());
      setShowHideModal(false);
      setHideReason('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnhide = async () => {
    setIsLoading(true);
    try {
      await unhidePost(postId);
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approvePost(postId);
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsLoading(true);
    try {
      if (isFeatured) {
        await unmarkAsFeatured(postId);
      } else {
        await markAsFeatured(postId);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSupplement = async () => {
    if (!supplementMessage.trim()) {
      alert('请输入需要补充的内容');
      return;
    }
    setIsLoading(true);
    try {
      await requestSupplement(postId, supplementMessage.trim());
      setShowSupplementModal(false);
      setSupplementMessage('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="metal-card border-warning-orange-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning-orange-400" />
          <h3 className="text-lg font-medium text-white">版主操作</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {status === 'pending_review' && (
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-4 py-3 rounded-lg font-medium transition-all flex flex-col items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm">审核通过</span>
            </button>
          )}
          
          {status !== 'pending_review' && (
            <button
              onClick={isHidden ? handleUnhide : () => setShowHideModal(true)}
              disabled={isLoading}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                isHidden 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isHidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              <span className="text-sm">{isHidden ? '恢复显示' : '隐藏帖子'}</span>
            </button>
          )}

          <button
            onClick={handleToggleFeatured}
            disabled={isLoading}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
              isFeatured 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30' 
                : 'bg-charcoal-700/50 text-charcoal-300 border border-charcoal-600 hover:bg-charcoal-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Star className={`w-5 h-5 ${isFeatured ? 'fill-current' : ''}`} />
            <span className="text-sm">{isFeatured ? '取消精品' : '标记精品'}</span>
          </button>

          {status !== 'pending_review' && (
            <button
              onClick={() => setShowSupplementModal(true)}
              disabled={isLoading}
              className="px-4 py-3 rounded-lg font-medium transition-all flex flex-col items-center gap-1 bg-warning-orange-500/20 text-warning-orange-400 border border-warning-orange-500/50 hover:bg-warning-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm">要求补充</span>
            </button>
          )}

          {status === 'pending_review' && (
            <div className="px-4 py-3 rounded-lg font-medium flex flex-col items-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/50">
              <Clock className="w-5 h-5" />
              <span className="text-sm">待审核</span>
            </div>
          )}
        </div>

        {hiddenReason && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">
              <span className="font-medium">隐藏原因：</span>{hiddenReason}
            </p>
          </div>
        )}

        {requireSupplement && (
          <div className="mt-4 p-3 rounded-lg bg-warning-orange-500/10 border border-warning-orange-500/30">
            <p className="text-sm text-warning-orange-400">
              <span className="font-medium">补充要求：</span>{requireSupplement}
            </p>
          </div>
        )}
      </div>

      {showHideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="metal-card w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">隐藏帖子</h3>
              <button
                onClick={() => setShowHideModal(false)}
                className="p-1 rounded-lg hover:bg-charcoal-700 transition-colors"
              >
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>
            
            <p className="text-charcoal-400 text-sm mb-4">
              请输入隐藏该帖子的原因，该原因将对用户可见。
            </p>
            
            <textarea
              value={hideReason}
              onChange={(e) => setHideReason(e.target.value)}
              placeholder="例如：该改装内容存在较高违法风险，请补充更多合规性说明..."
              rows={4}
              className="input-field resize-none mb-4"
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowHideModal(false)}
                className="btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleHide}
                className="btn-danger"
              >
                确认隐藏
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupplementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="metal-card w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">要求补充说明</h3>
              <button
                onClick={() => setShowSupplementModal(false)}
                className="p-1 rounded-lg hover:bg-charcoal-700 transition-colors"
              >
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>
            
            <p className="text-charcoal-400 text-sm mb-4">
              请描述需要用户补充哪些信息，帖子将被暂时隐藏直到用户补充完成。
            </p>
            
            <textarea
              value={supplementMessage}
              onChange={(e) => setSupplementMessage(e.target.value)}
              placeholder="例如：请补充改装厂的相关资质证明、与车管所沟通的具体记录..."
              rows={4}
              className="input-field resize-none mb-4"
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSupplementModal(false)}
                className="btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleRequestSupplement}
                className="btn-warning"
              >
                发送要求
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
