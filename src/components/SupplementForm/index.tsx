import { useState } from 'react';
import { X, Upload, Send, AlertCircle } from 'lucide-react';
import { Post } from '@/types';
import { usePostStore } from '@/store/postStore';

interface SupplementFormProps {
  post: Post;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SupplementForm({ post, onClose, onSuccess }: SupplementFormProps) {
  const [supplementalContent, setSupplementalContent] = useState('');
  const [supplementalImages, setSupplementalImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { submitSupplement } = usePostStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSupplementalImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setSupplementalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementalContent.trim() && supplementalImages.length === 0) {
      alert('请至少补充一些内容或图片');
      return;
    }

    setSubmitting(true);
    try {
      await submitSupplement({
        postId: post.id,
        supplementalContent: supplementalContent.trim(),
        supplementalImages,
      });
      alert('补充资料已提交，等待版主审核');
      onSuccess?.();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="metal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">补充资料</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5 text-charcoal-400" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-warning-orange-500/10 border border-warning-orange-500/30 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-warning-orange-400 mb-1">版主要求补充说明</h4>
              <p className="text-charcoal-300 text-sm">{post.requireSupplement}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-charcoal-800/50 rounded-lg">
          <h4 className="font-medium text-white mb-2">原帖子</h4>
          <p className="text-charcoal-400 text-sm">{post.title}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">补充说明 *</label>
            <textarea
              value={supplementalContent}
              onChange={(e) => setSupplementalContent(e.target.value)}
              placeholder="请详细说明补充内容，如备案凭证、改装细节、相关证明等..."
              className="w-full h-32 px-4 py-3 bg-charcoal-800/50 border border-charcoal-700 rounded-lg text-white placeholder-charcoal-500 focus:border-metal-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-medium mb-2">补充图片</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {supplementalImages.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {supplementalImages.length < 9 && (
                <label className="aspect-square border-2 border-dashed border-charcoal-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-metal-blue-500 transition-colors bg-charcoal-800/30">
                  <Upload className="w-8 h-8 text-charcoal-500 mb-2" />
                  <span className="text-charcoal-500 text-sm">上传图片</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-charcoal-500 text-xs">最多上传9张图片，支持拖拽上传</p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-charcoal-600 text-charcoal-400 hover:bg-charcoal-800 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? '提交中...' : '提交补充资料'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
