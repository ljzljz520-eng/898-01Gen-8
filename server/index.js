import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_FILES = {
  posts: path.join(DATA_DIR, 'posts.json'),
  users: path.join(DATA_DIR, 'users.json'),
  cars: path.join(DATA_DIR, 'cars.json'),
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const readData = (file) => {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
};

const initMockData = () => {
  const mockUsers = [
    { id: 'user-1', nickname: '改装达人小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'user-2', nickname: '轮毂专家老李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
    { id: 'user-3', nickname: '灯光发烧友', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', role: 'user', createdAt: '2024-01-03T00:00:00.000Z' },
    { id: 'mod-1', nickname: '版主-阿强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', role: 'moderator', createdAt: '2023-12-01T00:00:00.000Z' },
    { id: 'mod-2', nickname: '版主-小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', role: 'moderator', createdAt: '2023-12-05T00:00:00.000Z' },
  ];

  const mockCars = [
    { id: 'car-1', brand: '宝马', model: '3系', year: '2024', brandInitial: 'B' },
    { id: 'car-2', brand: '奔驰', model: 'C级', year: '2023', brandInitial: 'B' },
    { id: 'car-3', brand: '奥迪', model: 'A4L', year: '2024', brandInitial: 'A' },
    { id: 'car-4', brand: '大众', model: '高尔夫GTI', year: '2023', brandInitial: 'D' },
    { id: 'car-5', brand: '丰田', model: '凯美瑞', year: '2024', brandInitial: 'F' },
    { id: 'car-6', brand: '本田', model: '雅阁', year: '2023', brandInitial: 'B' },
    { id: 'car-7', brand: '别克', model: '君威GS', year: '2024', brandInitial: 'B' },
    { id: 'car-8', brand: '马自达', model: '阿特兹', year: '2023', brandInitial: 'M' },
    { id: 'car-9', brand: '日产', model: '天籁', year: '2024', brandInitial: 'R' },
    { id: 'car-10', brand: '福特', model: '蒙迪欧', year: '2023', brandInitial: 'F' },
    { id: 'car-11', brand: '雪佛兰', model: '迈锐宝XL', year: '2024', brandInitial: 'X' },
    { id: 'car-12', brand: '起亚', model: 'K5', year: '2023', brandInitial: 'Q' },
    { id: 'car-13', brand: '现代', model: '索纳塔', year: '2024', brandInitial: 'X' },
    { id: 'car-14', brand: '标致', model: '508L', year: '2023', brandInitial: 'B' },
    { id: 'car-15', brand: '雪铁龙', model: 'C6', year: '2024', brandInitial: 'X' },
    { id: 'car-16', brand: '斯巴鲁', model: '力狮', year: '2023', brandInitial: 'S' },
    { id: 'car-17', brand: '雷克萨斯', model: 'ES', year: '2024', brandInitial: 'L' },
    { id: 'car-18', brand: '英菲尼迪', model: 'Q50L', year: '2023', brandInitial: 'Y' },
    { id: 'car-19', brand: '沃尔沃', model: 'S60', year: '2024', brandInitial: 'W' },
    { id: 'car-20', brand: '凯迪拉克', model: 'CT5', year: '2023', brandInitial: 'K' },
  ];

  const now = new Date().toISOString();
  const mockPosts = [
    {
      id: uuidv4(),
      userId: 'user-1',
      user: mockUsers[0],
      title: '宝马3系改装19寸锻造轮毂作业分享',
      content: '原厂18寸实在太小气，咬牙上了19寸锻造。选的是BBS款式，数据是前8.5J ET30，后9.5J ET35，完美齐边。轮胎用的是米其林PS4S，抓地力提升明显。备案过程很顺利，车管所验车拍照20分钟搞定。',
      images: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=BMW%203%20series%20with%2019%20inch%20forged%20wheels%20modified%20car%20sporty%20look%20garage%20background&image_size=square_hd',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close%20up%20of%20BBS%20style%20forged%20wheel%20on%20BMW%203%20series%20brake%20caliper&image_size=square_hd',
      ],
      modificationType: 'wheel',
      carModel: mockCars[0],
      filingStatus: 'filed',
      cost: 12800,
      inspectionImpact: 'no_impact',
      status: 'published',
      isFeatured: true,
      comments: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: 'user-2',
      user: mockUsers[1],
      title: '高尔夫GTI升级LED矩阵大灯，夜晚行车安全感倍增',
      content: '原厂蜡烛灯实在受不了，换了全套LED矩阵大灯。带自动远近光切换，转向辅助照明，还有流水转向灯。年检的时候找了黄牛，花了200块搞定。建议大家还是尽量走正规备案流程，省得以后麻烦。',
      images: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=VW%20Golf%20GTI%20with%20LED%20matrix%20headlights%20night%20driving%20blue%20light&image_size=square_hd',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close%20up%20LED%20matrix%20headlight%20VW%20Golf%20GTI%20daytime%20running%20light&image_size=square_hd',
      ],
      modificationType: 'light',
      carModel: mockCars[3],
      filingStatus: 'not_filed',
      cost: 6500,
      inspectionImpact: 'may_fail',
      status: 'published',
      isFeatured: false,
      comments: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: 'user-3',
      user: mockUsers[2],
      title: '奥迪A4L更换TEIN避震，舒适性与操控兼顾',
      content: '原车避震太硬，过减速带颠得不行。换了TEIN的EnduraPro PLUS，高低软硬可调。现在过弯侧倾小了很多，舒适性也提升了。车身降低了2指，视觉效果更运动。备案已经通过，花费300元工本费。',
      images: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Audi%20A4L%20lowered%20suspension%20modified%20stance%20parked%20street&image_size=square_hd',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=TEIN%20coilover%20suspension%20installation%20car%20lift%20workshop&image_size=square_hd',
      ],
      modificationType: 'suspension',
      carModel: mockCars[2],
      filingStatus: 'filed',
      cost: 8900,
      inspectionImpact: 'no_impact',
      status: 'published',
      isFeatured: true,
      comments: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  if (readData(DATA_FILES.users).length === 0) {
    writeData(DATA_FILES.users, mockUsers);
  }
  if (readData(DATA_FILES.cars).length === 0) {
    writeData(DATA_FILES.cars, mockCars);
  }
  if (readData(DATA_FILES.posts).length === 0) {
    writeData(DATA_FILES.posts, mockPosts);
  }
};

initMockData();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  const users = readData(DATA_FILES.users);
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const users = readData(DATA_FILES.users);
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

app.post('/api/users/login', (req, res) => {
  const { userId } = req.body;
  const users = readData(DATA_FILES.users);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

app.get('/api/cars', (req, res) => {
  const cars = readData(DATA_FILES.cars);
  res.json(cars);
});

app.get('/api/posts', (req, res) => {
  const { modificationType, filingStatus, search, includeHidden, userId, status, isFeatured, carBrand, carModel } = req.query;
  let posts = readData(DATA_FILES.posts);
  const users = readData(DATA_FILES.users);
  const cars = readData(DATA_FILES.cars);

  posts = posts.map(post => ({
    ...post,
    user: users.find(u => u.id === post.userId) || post.user,
    carModel: cars.find(c => c.id === post.carModelId) || post.carModel,
  }));

  if (includeHidden !== 'true') {
    posts = posts.filter(p => p.status !== 'hidden');
  }

  if (status) {
    posts = posts.filter(p => p.status === status);
  }

  if (userId) {
    posts = posts.filter(p => p.userId === userId);
  }

  if (modificationType && modificationType !== 'all') {
    posts = posts.filter(p => p.modificationType === modificationType);
  }

  if (filingStatus) {
    posts = posts.filter(p => p.filingStatus === filingStatus);
  }

  if (isFeatured === 'true') {
    posts = posts.filter(p => p.isFeatured);
  }

  if (carBrand && carModel) {
    posts = posts.filter(p => p.carModel.brand === carBrand && p.carModel.model === carModel);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.content.toLowerCase().includes(searchLower) ||
      p.carModel.brand.toLowerCase().includes(searchLower) ||
      p.carModel.model.toLowerCase().includes(searchLower)
    );
  }

  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const posts = readData(DATA_FILES.posts);
  const users = readData(DATA_FILES.users);
  const cars = readData(DATA_FILES.cars);
  const post = posts.find(p => p.id === req.params.id);
  
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  
  const postWithData = {
    ...post,
    user: users.find(u => u.id === post.userId) || post.user,
    carModel: cars.find(c => c.id === post.carModelId) || post.carModel,
    comments: post.comments.map(c => ({
      ...c,
      user: users.find(u => u.id === c.userId) || c.user,
    })),
  };
  
  res.json(postWithData);
});

app.post('/api/posts', (req, res) => {
  const { userId, title, content, images, modificationType, carModelId, filingStatus, cost, inspectionImpact } = req.body;
  
  if (!userId || !title || !content || !modificationType || !carModelId || !filingStatus || !cost || !inspectionImpact) {
    return res.status(400).json({ error: '缺少必填字段' });
  }

  const users = readData(DATA_FILES.users);
  const cars = readData(DATA_FILES.cars);
  const user = users.find(u => u.id === userId);
  const car = cars.find(c => c.id === carModelId);
  
  if (!user) return res.status(404).json({ error: '用户不存在' });
  if (!car) return res.status(404).json({ error: '车型不存在' });

  const now = new Date().toISOString();
  const newPost = {
    id: uuidv4(),
    userId,
    user,
    title,
    content,
    images: images || [],
    modificationType,
    carModelId,
    carModel: car,
    filingStatus,
    cost: Number(cost),
    inspectionImpact,
    status: 'published',
    isFeatured: false,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };

  const posts = readData(DATA_FILES.posts);
  posts.unshift(newPost);
  writeData(DATA_FILES.posts, posts);
  
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
  const posts = readData(DATA_FILES.posts);
  const index = posts.findIndex(p => p.id === req.params.id);
  
  if (index === -1) return res.status(404).json({ error: '帖子不存在' });

  const { supplementalContent, supplementalImages, ...otherUpdates } = req.body;
  
  let updates = otherUpdates;
  
  if (supplementalContent || supplementalImages) {
    const supplementEntry = {
      id: uuidv4(),
      content: supplementalContent || '',
      images: supplementalImages || [],
      createdAt: new Date().toISOString(),
    };
    
    const existingSupplements = posts[index].supplements || [];
    updates = {
      ...updates,
      supplements: [...existingSupplements, supplementEntry],
      requireSupplement: undefined,
      status: 'pending_review',
    };
  }

  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  writeData(DATA_FILES.posts, posts);
  res.json(posts[index]);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { userId, content } = req.body;
  if (!userId || !content) return res.status(400).json({ error: '缺少必填字段' });

  const posts = readData(DATA_FILES.posts);
  const users = readData(DATA_FILES.users);
  const index = posts.findIndex(p => p.id === req.params.id);
  
  if (index === -1) return res.status(404).json({ error: '帖子不存在' });
  
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });

  const newComment = {
    id: uuidv4(),
    userId,
    user,
    content,
    createdAt: new Date().toISOString(),
  };

  posts[index].comments.push(newComment);
  posts[index].updatedAt = new Date().toISOString();
  writeData(DATA_FILES.posts, posts);
  
  res.status(201).json(newComment);
});

app.get('/api/cars/featured', (req, res) => {
  const cars = readData(DATA_FILES.cars);
  const posts = readData(DATA_FILES.posts);
  
  const carsWithCount = cars.map(car => {
    const featuredCount = posts.filter(
      p => p.isFeatured && p.carModelId === car.id && p.status !== 'hidden'
    ).length;
    return { ...car, featuredCount };
  });
  
  res.json(carsWithCount);
});

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
