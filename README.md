# Next.js TabBar 应用 - MongoDB集成版

这是一个使用 Next.js 构建的移动端风格应用，包含底部 TabBar 导航和完整的 MongoDB 数据库集成。

## 🚀 功能特性

### 🏠 底部 TabBar 导航
- **首页** (`/`) - 应用主页，包含搜索栏、轮播图、功能卡片
- **服务** (`/service`) - 服务套餐页面，展示数据库中的套餐数据
- **消息** (`/message`) - 消息中心，显示系统通知和消息列表
- **我的** (`/profile`) - 个人中心，用户信息和设置菜单

### 📦 套餐管理系统
- **套餐展示** - 从MongoDB数据库动态加载套餐信息
- **分类筛选** - 按套餐类型（基础/进阶/高级/定制）筛选
- **搜索功能** - 支持按名称和描述搜索套餐
- **收藏功能** - 用户可以收藏/取消收藏套餐
- **价格展示** - 格式化的价格显示
- **销量统计** - 显示销量和好评率
- **标签系统** - 套餐标签分类

### 🗄️ 数据库集成
- **MongoDB Atlas** - 云端MongoDB数据库
- **Mongoose ORM** - 数据建模和验证
- **RESTful API** - 完整的CRUD操作
- **数据验证** - 服务端数据验证和错误处理

### 📱 移动端优化
- 响应式设计，适配各种屏幕尺寸
- 触摸友好的交互体验
- 平滑的页面切换动画
- 现代化的 UI 设计

## 🏗️ 项目结构

```
my-app/
├── components/
│   ├── TabBar.js              # 底部导航栏组件
│   ├── TabBar.module.css      # TabBar 样式
│   ├── PackageCard.js         # 套餐卡片组件
│   ├── PackageCard.module.css # 套餐卡片样式
│   └── Layout.js              # 布局组件
├── pages/
│   ├── index.js               # 首页
│   ├── service.js             # 服务套餐页面
│   ├── message.js             # 消息页面
│   ├── profile.js             # 个人中心
│   ├── favorites.js           # 收藏页面
│   ├── _app.js                # 应用入口
│   └── api/
│       └── packages/
│           ├── index.js       # 套餐列表API
│           ├── [id].js        # 单个套餐API
│           └── [id]/
│               └── favorite.js # 收藏功能API
├── models/
│   └── Package.js             # 套餐数据模型
├── lib/
│   └── mongodb.js             # 数据库连接配置
├── hooks/
│   └── usePackages.js         # 自定义Hook
├── utils/
│   ├── api.js                 # API工具函数
│   └── routes.js              # 路由配置
├── styles/
│   └── globals.css            # 全局样式
└── public/                    # 静态资源
```

## 📊 数据库Schema

### 套餐模型 (Package)
```javascript
{
  name: String,              // 套餐名称
  price: Number,             // 单价
  description: String,       // 描述
  salesCount: Number,        // 销量
  isFavorite: Boolean,       // 是否收藏
  positiveReviews: Number,   // 好评个数
  totalReviews: Number,      // 总评论数
  imageUrl: String,          // 图片URL
  category: String,          // 分类
  status: String,            // 状态
  tags: [String],            // 标签
  createdAt: Date,           // 创建时间
  updatedAt: Date            // 更新时间
}
```

## 🚀 开始使用

### 1. 安装依赖
```bash
npm install
# 或
yarn install
```

### 2. 环境配置
数据库连接已配置MongoDB Atlas：
```
mongodb+srv://2230307367:chen5678@cluster0.gxgyome.mongodb.net/
```

### 3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 添加演示数据
- 访问服务页面 (`/service`)
- 点击"添加演示数据"按钮
- 系统会自动创建3个示例套餐

## 🔧 API 接口

### 套餐相关接口

#### 获取套餐列表
```
GET /api/packages
Query参数:
- category: 分类筛选
- search: 搜索关键词
- page: 页码
- limit: 每页数量
```

#### 获取套餐详情
```
GET /api/packages/[id]
```

#### 创建套餐
```
POST /api/packages
Body: Package数据
```

#### 更新套餐
```
PUT /api/packages/[id]
Body: 更新的数据
```

#### 删除套餐
```
DELETE /api/packages/[id]
```

#### 切换收藏状态
```
PUT /api/packages/[id]/favorite
Body: { isFavorite: boolean }
```

## 🎨 技术栈

- **Next.js 15** - React 框架
- **React 18** - UI 库
- **MongoDB Atlas** - 云端数据库
- **Mongoose** - MongoDB ODM
- **CSS Modules** - 样式解决方案
- **Tailwind CSS** - CSS 框架
- **响应式设计** - 移动端适配

## 📝 功能演示

### 1. 套餐浏览
- 访问 `/service` 页面
- 查看套餐列表和详细信息
- 使用分类筛选和搜索功能

### 2. 收藏功能
- 点击套餐卡片右上角的心形按钮
- 访问 `/favorites` 查看收藏的套餐
- 在个人中心访问收藏页面

### 3. 数据管理
- 通过API接口进行CRUD操作
- 数据实时同步到MongoDB
- 支持数据验证和错误处理

## 🔍 开发建议

### 添加新功能
1. 在相应目录创建组件文件
2. 更新路由配置
3. 添加API接口（如需要）
4. 更新数据模型（如需要）

### 样式定制
- 全局样式：编辑 `styles/globals.css`
- 组件样式：使用 CSS Modules
- 主题色彩：修改 CSS 变量

### 数据库操作
- 使用 Mongoose 模型进行数据操作
- 在 `models/` 目录添加新的数据模型
- API 路由在 `pages/api/` 目录

## 🌐 部署

### Vercel 部署
```bash
npm run build
npm start
```

### 环境变量
确保在生产环境设置正确的数据库连接字符串。

## 📱 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端浏览器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
