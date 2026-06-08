import { useState, useEffect } from 'react';
import { X, User, Shield, Check } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { UserRole } from '@/types';

interface LoginModalProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const { users, login, fetchUsers, loading } = useUserStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => u.role === selectedRole);

  const handleLogin = async () => {
    if (!selectedUserId) {
      alert('请选择一个用户');
      return;
    }
    try {
      await login(selectedUserId);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : '登录失败');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="metal-card w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">选择登录用户</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-charcoal-700 transition-colors"
            >
              <X className="w-5 h-5 text-charcoal-400" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setSelectedRole('user'); setSelectedUserId(null); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedRole === 'user'
                ? 'bg-metal-blue-500/20 border border-metal-blue-500/50 text-metal-blue-400'
                : 'bg-charcoal-800/50 border border-charcoal-700 text-charcoal-400 hover:border-charcoal-600'
            }`}
          >
            <User className="w-4 h-4" />
            普通用户
          </button>
          <button
            onClick={() => { setSelectedRole('moderator'); setSelectedUserId(null); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedRole === 'moderator'
                ? 'bg-warning-orange-500/20 border border-warning-orange-500/50 text-warning-orange-400'
                : 'bg-charcoal-800/50 border border-charcoal-700 text-charcoal-400 hover:border-charcoal-600'
            }`}
          >
            <Shield className="w-4 h-4" />
            版主
          </button>
        </div>

        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-charcoal-500">
              {loading ? '加载中...' : '暂无用户'}
            </div>
          ) : (
            filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                  selectedUserId === user.id
                    ? 'bg-metal-blue-500/20 border border-metal-blue-500/50'
                    : 'bg-charcoal-800/30 border border-charcoal-700 hover:border-charcoal-600'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="w-10 h-10 rounded-full border-2 border-charcoal-700"
                />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{user.nickname}</p>
                  <p className="text-charcoal-500 text-sm">
                    {user.role === 'moderator' ? '论坛版主' : '普通用户'}
                  </p>
                </div>
                {selectedUserId === user.id && (
                  <Check className={`w-5 h-5 ${
                    selectedRole === 'moderator' ? 'text-warning-orange-400' : 'text-metal-blue-400'
                  }`} />
                )}
              </button>
            ))
          )}
        </div>

        <button
          onClick={handleLogin}
          disabled={!selectedUserId || loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </div>
    </div>
  );
}
