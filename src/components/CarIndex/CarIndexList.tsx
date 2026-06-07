import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Car, Star, ChevronRight } from 'lucide-react';
import { CarModel } from '@/types';

interface CarIndexListProps {
  cars: (CarModel & { featuredCount: number })[];
}

export default function CarIndexList({ cars }: CarIndexListProps) {
  const [activeLetter, setActiveLetter] = useState<string>('');

  const groupedCars = useMemo(() => {
    const groups: Record<string, (CarModel & { featuredCount: number })[]> = {};
    
    cars.forEach(car => {
      const letter = car.brandInitial.toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(car);
    });
    
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, cars]) => ({
        letter,
        cars: cars.sort((a, b) => a.brand.localeCompare(b.brand)),
      }));
  }, [cars]);

  const letters = groupedCars.map(g => g.letter);

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const element = document.getElementById(`brand-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const carsWithContent = cars.filter(c => c.featuredCount > 0);
  const totalFeatured = carsWithContent.reduce((sum, c) => sum + c.featuredCount, 0);

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="metal-card mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-metal-blue-500 to-purple-600 flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">车型改装案例索引</h2>
              <p className="text-charcoal-400 text-sm">
                已收录 <span className="text-metal-blue-400 font-medium">{carsWithContent.length}</span> 款车型，
                共 <span className="text-amber-400 font-medium">{totalFeatured}</span> 个精品改装案例
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {groupedCars.map(({ letter, cars }) => (
            <section key={letter} id={`brand-${letter}`} className="opacity-0 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-metal-blue-500 to-metal-blue-700 flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-white">{letter}</span>
                </div>
                <h3 className="text-lg font-medium text-white">以 {letter} 开头的品牌</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.map((car, index) => (
                  <Link
                    key={car.id}
                    to={`/index/${encodeURIComponent(car.brand)}/${encodeURIComponent(car.model)}`}
                    className="metal-card group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-charcoal-700 to-charcoal-800 flex items-center justify-center group-hover:from-metal-blue-500/20 group-hover:to-purple-500/20 transition-all">
                          <Car className="w-6 h-6 text-charcoal-400 group-hover:text-metal-blue-400 transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white group-hover:text-metal-blue-400 transition-colors">
                            {car.brand} {car.model}
                          </h4>
                          <p className="text-xs text-charcoal-500">{car.year} 款</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {car.featuredCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            {car.featuredCount}
                          </span>
                        ) : (
                          <span className="text-xs text-charcoal-600">暂无案例</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-charcoal-500 group-hover:text-metal-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="hidden lg:block sticky top-24 self-start">
        <div className="metal-card py-4">
          <div className="flex flex-col gap-1">
            {letters.map(letter => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  activeLetter === letter
                    ? 'bg-metal-blue-500 text-white'
                    : 'text-charcoal-400 hover:bg-charcoal-700 hover:text-white'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
