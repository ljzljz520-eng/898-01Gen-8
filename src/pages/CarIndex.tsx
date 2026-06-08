import { useState, useEffect } from 'react';
import { usePostStore } from '@/store/postStore';
import { CarModel } from '@/types';
import { CarIndexList } from '@/components/CarIndex';

export default function CarIndex() {
  const { getCarsWithFeaturedCount } = usePostStore();
  const [carsWithCount, setCarsWithCount] = useState<(CarModel & { featuredCount: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getCarsWithFeaturedCount();
      setCarsWithCount(data);
      setLoading(false);
    };
    fetchData();
  }, [getCarsWithFeaturedCount]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 mx-auto mb-4 bg-charcoal-800 rounded" />
          <div className="h-4 w-48 mx-auto bg-charcoal-800 rounded" />
        </div>
      </div>
    );
  }

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
