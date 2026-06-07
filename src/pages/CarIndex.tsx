import { usePostStore } from '@/store/postStore';
import { CarIndexList } from '@/components/CarIndex';

export default function CarIndex() {
  const { getCarsWithFeaturedCount } = usePostStore();
  const carsWithCount = getCarsWithFeaturedCount();

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          车型改装案例索引
        </h1>
        <p className="text-charcoal-400">
          按品牌车型浏览精品改装案例，找到适合你的改装方案
        </p>
      </div>

      <CarIndexList cars={carsWithCount} />
    </div>
  );
}
