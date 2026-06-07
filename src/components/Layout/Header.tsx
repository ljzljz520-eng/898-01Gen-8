import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenSquare, User, Car, Shield } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-charcoal-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-charcoal-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-metal-blue-500 to-metal-blue-700 flex items-center justify-center group-hover:animate-glow">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold gradient-text">
                MODTUNING
              </h1>
              <p className="text-xs text-charcoal-400 -mt-1">改装备案社区</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索车型、改装内容..."
                className="input-field pl-10 pr-4 py-2"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <Link
              to="/index"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-charcoal-300 hover:text-white hover:bg-charcoal-700/50 transition-colors"
            >
              <Car className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">车型索引</span>
            </Link>

            <Link
              to="/create"
              className="btn-primary flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4" />
              <span className="hidden sm:inline">发布改装</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-charcoal-700/50 transition-colors"
            >
              <div className="relative">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.nickname}
                    className="w-8 h-8 rounded-full border-2 border-metal-blue-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-charcoal-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-charcoal-400" />
                  </div>
                )}
                {currentUser?.role === 'moderator' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <span className="hidden sm:inline text-sm text-charcoal-300">
                {currentUser?.nickname || '登录'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
