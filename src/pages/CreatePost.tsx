import PostForm from '@/components/PostForm';

export default function CreatePost() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            发布改装分享
          </h1>
          <p className="text-charcoal-400">
            分享你的改装经验，帮助更多车友合规改装
          </p>
        </div>

        <PostForm />
      </div>
    </div>
  );
}
