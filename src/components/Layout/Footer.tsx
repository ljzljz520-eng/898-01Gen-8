import { Car, Github, Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 border-t border-charcoal-700/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-metal-blue-500 to-metal-blue-700 flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold gradient-text">MODTUNING</h3>
                <p className="text-xs text-charcoal-400 -mt-1">改装备案社区</p>
              </div>
            </div>
            <p className="text-charcoal-400 text-sm max-w-md leading-relaxed">
              致力于构建合法、规范的汽车改装交流环境。分享改装经验，交流备案心得，
              让每一位改装爱好者都能合规改装、安心驾驶。
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-charcoal-400 hover:text-metal-blue-400 text-sm transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/index" className="text-charcoal-400 hover:text-metal-blue-400 text-sm transition-colors">
                  车型索引
                </a>
              </li>
              <li>
                <a href="/create" className="text-charcoal-400 hover:text-metal-blue-400 text-sm transition-colors">
                  发布改装
                </a>
              </li>
              <li>
                <a href="/profile" className="text-charcoal-400 hover:text-metal-blue-400 text-sm transition-colors">
                  个人中心
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">联系我们</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-charcoal-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>support@modtuning.com</span>
              </li>
              <li className="flex items-center gap-2 text-charcoal-400 text-sm">
                <Github className="w-4 h-4" />
                <span>github.com/modtuning</span>
              </li>
              <li className="flex items-center gap-2 text-charcoal-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>举报违规内容</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-700/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-charcoal-500 text-sm">
            © 2024 MODTUNING. 改装有风险，备案需合规。
          </p>
          <div className="flex items-center gap-6 text-charcoal-500 text-sm">
            <a href="#" className="hover:text-charcoal-300 transition-colors">用户协议</a>
            <a href="#" className="hover:text-charcoal-300 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-charcoal-300 transition-colors">社区规范</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
