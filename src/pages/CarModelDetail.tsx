import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Car } from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import PostCard from '@/components/PostCard';

export default function CarModelDetail() {
  const { brand, model } = useParams<{ brand: string; model: string }>();
  const { getFeaturedPostsByCar, getCarsWithFeaturedCount } = usePostStore();

  const decodedBrand = decodeURIComponent(brand || '');
  const decodedModel = decodeURIComponent(model || '');
  
  const featuredPosts = getFeaturedPostsByCar(decodedBrand, decodedModel);
  const allCars = getCarsWithFeaturedCount();
  const carInfo = allCars.find(c => c.brand === decodedBrand && c.model === decodedModel);

  return (
    <div className="container mx-auto px-4">
      <Link
        to="/index"
        className="flex items-center gap-2 text-charcoal-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回车型索引
      </Link>

      <div className="metal-card mb-8 bg-gradient-to-br from-charcoal-800/80 to-charcoal-900/80">
        <div className="py-8 px-6 md:py-10 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-metal-blue-500 to-purple-600 flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                {decodedBrand} {decodedModel}
              </h1>
              {carInfo && (
                <p className="text-charcoal-400 mt-1">{carInfo.year} 款</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span className="text-amber-400 font-medium">
                {featuredPosts.length} 个精品案例
              </span>
            </div>
          </div>
        </div>
      </div>

      {featuredPosts.length === 0 ? (
        <div className="metal-card text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-800 flex items-center justify-center">
            <Star className="w-10 h-10 text-charcoal-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">暂无精品案例</h3>
          <p className="text-charcoal-400 mb-6">
            该车型还没有精品改装案例，快来分享你的改装经验吧
          </p>
          <Link to="/create" className="btn-primary">
            发布改装分享
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            精品改装案例
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
