import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircleDot, Lightbulb, Gauge, Armchair, Car, Filter, TrendingUp } from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { useUserStore } from '@/store/userStore';
import { ModificationType, FilingStatus, MODIFICATION_TYPE_LABELS, FILING_STATUS_LABELS } from '@/types';
import PostCard from '@/components/PostCard';

const typeIcons = {
  all: TrendingUp,
  wheel: CircleDot,
  light: Lightbulb,
  suspension: Gauge,
  interior: Armchair,
};

const modificationTabs: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'wheel', label: '轮毂' },
  { key: 'light', label: '灯光' },
  { key: 'suspension', label: '避震' },
  { key: 'interior', label: '内饰' },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, getFilteredPosts } = usePostStore();
  const { currentUser } = useUserStore();
  
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('type') || 'all');
  const [filingFilter, setFilingFilter] = useState<FilingStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  useEffect(() => {
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    if (search) setSearchQuery(search);
    if (type) setActiveTab(type);
  }, [searchParams]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') {
      newParams.delete('type');
    } else {
      newParams.set('type', key);
    }
    setSearchParams(newParams);
  };

  const filteredPosts = getFilteredPosts({
    modificationType: activeTab,
    filingStatus: filingFilter || undefined,
    search: searchQuery,
    includeHidden: currentUser?.role === 'moderator',
  });

  return (
    <div className="container mx-auto px-4">
      <div className="metal-card mb-8 bg-gradient-to-br from-charcoal-800/80 to-charcoal-900/80 overflow-hidden">
        <div className="relative z-10 py-8 px-6 md:py-12 md:px-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="gradient-text">MODTUNING</span> 改装备案社区
            </h1>
            <p className="text-charcoal-300 text-lg mb-6 leading-relaxed">
              分享你的改装经验，交流备案心得。轮毂、灯光、避震、内饰，
              每一份分享都标注车型、备案状态、费用和年检影响，
              让改装更合规、更安心。
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-metal-blue-500/10 border border-metal-blue-500/30">
                <Car className="w-5 h-5 text-metal-blue-400" />
                <span className="text-metal-blue-400 font-medium">{posts.length} 篇改装分享</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-medium">
                  {posts.filter(p => p.isFeatured).length} 个精品案例
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="metal-card mb-6">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin pb-2">
          {modificationTabs.map(tab => {
            const Icon = typeIcons[tab.key as keyof typeof typeIcons];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`tab-item flex items-center gap-2 whitespace-nowrap ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-charcoal-500" />
            <span className="text-sm text-charcoal-500">备案状态：</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilingFilter('')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                !filingFilter
                  ? 'bg-metal-blue-500/20 text-metal-blue-400 border border-metal-blue-500/50'
                  : 'bg-charcoal-800 text-charcoal-400 border border-charcoal-700 hover:border-charcoal-600'
              }`}
            >
              全部
            </button>
            {(['filed', 'pending', 'not_filed'] as FilingStatus[]).map(status => (
              <button
                key={status}
                onClick={() => setFilingFilter(status)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  filingFilter === status
                    ? 'bg-metal-blue-500/20 text-metal-blue-400 border border-metal-blue-500/50'
                    : 'bg-charcoal-800 text-charcoal-400 border border-charcoal-700 hover:border-charcoal-600'
                }`}
              >
                {FILING_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="metal-card text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-800 flex items-center justify-center">
            <CircleDot className="w-10 h-10 text-charcoal-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">暂无相关内容</h3>
          <p className="text-charcoal-400 mb-6">试试其他筛选条件，或者发布第一篇改装分享吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
