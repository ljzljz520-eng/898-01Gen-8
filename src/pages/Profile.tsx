import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Eye, EyeOff, Star, Settings, LogOut, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';
import PostCard from '@/components/PostCard';
import SupplementForm from '@/components/SupplementForm';
import LoginModal from '@/components/LoginModal';

export default function Profile() {
  const { currentUser, switchRole, logout } = useUserStore();
  const { posts, refreshPosts } = usePostStore();
  const [activeTab, setActiveTab] = useState<'published' | 'hidden' | 'supplement' | 'pending'>('published');
  const [showSupplementForm, setShowSupplementForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-800 flex items-center justify-center">
          <User className="w-10 h-10 text-charcoal-600" />
        </div>
        <h2 className="text-2xl font-medium text-white mb-2">请先登录</h2>
        <p className="text-charcoal-400 mb-6">登录后可以发布改装分享和评论互动</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <User className="w-5 h-5" />
          立即登录
        </button>
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => {
              setShowLoginModal(false);
              refreshPosts();
            }}
          />
        )}
      </div>
    );
  }

  const myPosts = posts.filter(p => p.userId === currentUser.id);
  const publishedPosts = myPosts.filter(p => p.status !== 'hidden' && p.status !== 'pending_review');
  const hiddenPosts = myPosts.filter(p => p.status === 'hidden' && !p.requireSupplement);
  const supplementPosts = myPosts.filter(p => p.status === 'hidden' && p.requireSupplement);
  const pendingPosts = myPosts.filter(p => p.status === 'pending_review');

  const displayedPosts = activeTab === 'published' 
    ? publishedPosts 
    : activeTab === 'hidden' 
      ? hiddenPosts 
      : activeTab === 'supplement' 
        ? supplementPosts 
        : pendingPosts;

  const handleSupplementClick = (post: any) => {
    setSelectedPost(post);
    setShowSupplementForm(true);
  };

  const handleSupplementSuccess = () => {
    setShowSupplementForm(false);
    setSelectedPost(null);
    refreshPosts();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="metal-card mb-6">
            <div className="text-center pb-6 border-b border-charcoal-700/50 mb-6">
              <div className="relative inline-block mb-4">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.nickname}
                  className="w-24 h-24 rounded-full border-4 border-metal-blue-500/30"
                />
                {currentUser.role === 'moderator' && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-warning-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{currentUser.nickname}</h2>
              <p className="text-charcoal-400 text-sm">
                {currentUser.role === 'moderator' ? '论坛版主' : '普通用户'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">发布帖子</span>
                <span className="text-white font-medium">{myPosts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">精品案例</span>
                <span className="text-amber-400 font-medium">
                  {myPosts.filter(p => p.isFeatured).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">待补充</span>
                <span className="text-warning-orange-400 font-medium">{supplementPosts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">待审核</span>
                <span className="text-blue-400 font-medium">{pendingPosts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50">
                <span className="text-charcoal-400 text-sm">被隐藏</span>
                <span className="text-red-400 font-medium">{hiddenPosts.length}</span>
              </div>
            </div>
          </div>

          <div className="metal-card border-warning-orange-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-warning-orange-400" />
              <h3 className="text-lg font-medium text-white">演示模式</h3>
            </div>
            <p className="text-charcoal-400 text-sm mb-4">
              切换角色以体验不同权限的功能
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => switchRole('user')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  currentUser.role === 'user'
                    ? 'bg-metal-blue-500/20 border border-metal-blue-500/50'
                    : 'bg-charcoal-800/50 border border-charcoal-700 hover:border-charcoal-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-5 h-5 ${currentUser.role === 'user' ? 'text-metal-blue-400' : 'text-charcoal-400'}`} />
                  <span className={currentUser.role === 'user' ? 'text-metal-blue-400' : 'text-charcoal-300'}>
                    普通用户
                  </span>
                </div>
                {currentUser.role === 'user' && (
                  <ChevronRight className="w-5 h-5 text-metal-blue-400" />
                )}
              </button>

              <button
                onClick={() => switchRole('moderator')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  currentUser.role === 'moderator'
                    ? 'bg-warning-orange-500/20 border border-warning-orange-500/50'
                    : 'bg-charcoal-800/50 border border-charcoal-700 hover:border-charcoal-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className={`w-5 h-5 ${currentUser.role === 'moderator' ? 'text-warning-orange-400' : 'text-charcoal-400'}`} />
                  <span className={currentUser.role === 'moderator' ? 'text-warning-orange-400' : 'text-charcoal-300'}>
                    版主
                  </span>
                </div>
                {currentUser.role === 'moderator' && (
                  <ChevronRight className="w-5 h-5 text-warning-orange-400" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-6 border-b border-charcoal-700/50 flex-wrap">
            <button
              onClick={() => setActiveTab('published')}
              className={`tab-item ${activeTab === 'published' ? 'active' : ''}`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              已发布 ({publishedPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('supplement')}
              className={`tab-item ${activeTab === 'supplement' ? 'active' : ''}`}
            >
              <AlertCircle className="w-4 h-4 inline mr-2" />
              待补充 ({supplementPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              待审核 ({pendingPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('hidden')}
              className={`tab-item ${activeTab === 'hidden' ? 'active' : ''}`}
            >
              <EyeOff className="w-4 h-4 inline mr-2" />
              已隐藏 ({hiddenPosts.length})
            </button>
          </div>

          {displayedPosts.length === 0 ? (
            <div className="metal-card text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-800 flex items-center justify-center">
                {activeTab === 'published' ? (
                  <Star className="w-10 h-10 text-charcoal-600" />
                ) : activeTab === 'supplement' ? (
                  <AlertCircle className="w-10 h-10 text-charcoal-600" />
                ) : activeTab === 'pending' ? (
                  <Clock className="w-10 h-10 text-charcoal-600" />
                ) : (
                  <EyeOff className="w-10 h-10 text-charcoal-600" />
                )}
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                {activeTab === 'published' 
                  ? '暂无发布内容' 
                  : activeTab === 'supplement'
                    ? '暂无待补充内容'
                    : activeTab === 'pending'
                      ? '暂无待审核内容'
                      : '暂无被隐藏内容'}
              </h3>
              <p className="text-charcoal-400 mb-6">
                {activeTab === 'published' 
                  ? '还没有发布过改装分享，快来分享你的经验吧'
                  : activeTab === 'supplement'
                    ? '你发布的内容都已完整，无需补充'
                    : activeTab === 'pending'
                      ? '没有待审核的补充内容'
                      : '你发布的内容都已通过审核'
                }
              </p>
              {activeTab === 'published' && (
                <Link to="/create" className="btn-primary">
                  发布改装分享
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {displayedPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} index={index} />
                  {activeTab === 'supplement' && post.requireSupplement && (
                    <div className="mt-4 p-4 bg-warning-orange-500/10 border border-warning-orange-500/30 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-warning-orange-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-warning-orange-400 mb-1">版主要求补充</h4>
                            <p className="text-charcoal-300 text-sm mb-3">{post.requireSupplement}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSupplementClick(post)}
                          className="btn-primary text-sm px-4 py-2 flex-shrink-0"
                        >
                          补充资料
                        </button>
                      </div>
                    </div>
                  )}
                  {activeTab === 'pending' && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-400 mb-1">待审核</h4>
                          <p className="text-charcoal-300 text-sm">补充资料已提交，等待版主审核</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'hidden' && post.hiddenReason && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <EyeOff className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-red-400 mb-1">已被隐藏</h4>
                          <p className="text-charcoal-300 text-sm">原因：{post.hiddenReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSupplementForm && selectedPost && (
        <SupplementForm
          post={selectedPost}
          onClose={() => {
            setShowSupplementForm(false);
            setSelectedPost(null);
          }}
          onSuccess={handleSupplementSuccess}
        />
      )}
    </div>
  );
}
