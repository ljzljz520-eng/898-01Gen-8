import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle, CheckCircle, CircleDot, Lightbulb, Gauge, Armchair } from 'lucide-react';
import { 
  ModificationType, 
  FilingStatus, 
  InspectionImpact,
  CreatePostData,
  MODIFICATION_TYPE_LABELS,
  FILING_STATUS_LABELS,
  INSPECTION_IMPACT_LABELS
} from '@/types';
import { usePostStore } from '@/store/postStore';
import { useUserStore } from '@/store/userStore';

const typeIcons = {
  wheel: CircleDot,
  light: Lightbulb,
  suspension: Gauge,
  interior: Armchair,
};

const modificationTypes: ModificationType[] = ['wheel', 'light', 'suspension', 'interior'];
const filingStatuses: FilingStatus[] = ['filed', 'pending', 'not_filed'];
const inspectionImpacts: InspectionImpact[] = ['no_impact', 'need_restore', 'may_fail'];

export default function PostForm() {
  const navigate = useNavigate();
  const { cars, addPost } = usePostStore();
  const { currentUser } = useUserStore();
  
  const [formData, setFormData] = useState<Omit<CreatePostData, 'images'>>({
    title: '',
    content: '',
    modificationType: 'wheel',
    carModelId: '',
    filingStatus: 'filed',
    cost: 0,
    inspectionImpact: 'no_impact',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入标题';
    } else if (formData.title.length < 5) {
      newErrors.title = '标题至少 5 个字符';
    }

    if (!formData.content.trim()) {
      newErrors.content = '请输入内容';
    } else if (formData.content.length < 20) {
      newErrors.content = '内容至少 20 个字符';
    }

    if (!formData.carModelId) {
      newErrors.carModelId = '请选择车型';
    }

    if (formData.cost <= 0) {
      newErrors.cost = '请输入有效的费用';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData: CreatePostData = {
        ...formData,
        images,
      };
      
      const newPost = addPost(postData);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate(`/post/${newPost.id}`);
      }, 1500);
    } catch (error) {
      alert(error instanceof Error ? error.message : '发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="metal-card p-12 text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">发布成功！</h3>
        <p className="text-charcoal-400">正在跳转到帖子详情页...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="metal-card">
        <h3 className="text-lg font-medium text-white mb-4">基本信息</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-charcoal-300 mb-2">
              改装类型 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {modificationTypes.map(type => {
                const Icon = typeIcons[type];
                const isSelected = formData.modificationType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, modificationType: type }))}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'border-metal-blue-500 bg-metal-blue-500/10 text-metal-blue-400' 
                        : 'border-charcoal-700 text-charcoal-400 hover:border-charcoal-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{MODIFICATION_TYPE_LABELS[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm text-charcoal-300 mb-2">
              标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="请输入吸引人的标题..."
              className="input-field"
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm text-charcoal-300 mb-2">
              车型选择 <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.carModelId}
              onChange={(e) => setFormData(prev => ({ ...prev, carModelId: e.target.value }))}
              className="input-field"
            >
              <option value="">请选择车型</option>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.year})
                </option>
              ))}
            </select>
            {errors.carModelId && <p className="mt-1 text-sm text-red-400">{errors.carModelId}</p>}
          </div>

          <div>
            <label className="block text-sm text-charcoal-300 mb-2">
              改装详情 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="详细描述您的改装过程、使用的产品、遇到的问题和心得体会..."
              rows={8}
              className="input-field resize-none"
            />
            {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
          </div>

          <div>
            <label className="block text-sm text-charcoal-300 mb-2">
              图片上传
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-charcoal-800">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-charcoal-600 flex flex-col items-center justify-center cursor-pointer hover:border-metal-blue-500 hover:bg-metal-blue-500/5 transition-all">
                  <Upload className="w-8 h-8 text-charcoal-500 mb-1" />
                  <span className="text-xs text-charcoal-500">上传图片</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="metal-card border-warning-orange-500/30 bg-gradient-to-br from-warning-orange-500/5 to-transparent">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-warning-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-white mb-1">合规信息 <span className="text-red-400">*</span></h3>
            <p className="text-sm text-charcoal-400">
              请如实填写以下信息，帮助其他车友了解改装的合规性和风险
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-charcoal-300 mb-2">备案状态</label>
            <select
              value={formData.filingStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, filingStatus: e.target.value as FilingStatus }))}
              className="input-field"
            >
              {filingStatuses.map(status => (
                <option key={status} value={status}>
                  {FILING_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-charcoal-300 mb-2">
              改装费用 (元) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={formData.cost || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
              placeholder="请输入费用"
              min="0"
              className="input-field"
            />
            {errors.cost && <p className="mt-1 text-sm text-red-400">{errors.cost}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-charcoal-300 mb-2">年检影响</label>
            <div className="grid grid-cols-3 gap-2">
              {inspectionImpacts.map(impact => {
                const isSelected = formData.inspectionImpact === impact;
                return (
                  <button
                    key={impact}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, inspectionImpact: impact }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-metal-blue-500/20 text-metal-blue-400 border border-metal-blue-500/50'
                        : 'bg-charcoal-800 text-charcoal-400 border border-charcoal-700 hover:border-charcoal-600'
                    }`}
                  >
                    {INSPECTION_IMPACT_LABELS[impact]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-outline"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '发布中...' : '发布改装分享'}
        </button>
      </div>
    </form>
  );
}
