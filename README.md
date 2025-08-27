# Next.js TabBar 应用

这是一个使用 Next.js 构建的移动端风格应用，包含底部 TabBar 导航。

## 功能特性

### 🏠 底部 TabBar 导航
- **首页** (`/`) - 应用主页，包含搜索栏、轮播图、功能卡片
- **服务** (`/service`) - 服务页面，展示各种服务项目
- **消息** (`/message`) - 消息中心，显示系统通知和消息列表
- **我的** (`/profile`) - 个人中心，用户信息和设置菜单

### 📱 移动端优化
- 响应式设计，适配各种屏幕尺寸
- 触摸友好的交互体验
- 平滑的页面切换动画
- 现代化的 UI 设计

### 🎨 设计特色
- 统一的视觉风格和色彩系统
- 卡片式布局设计
- 渐变背景和阴影效果
- 清晰的图标和排版

## 项目结构

```
my-app/
├── components/
│   ├── TabBar.js          # 底部导航栏组件
│   ├── TabBar.module.css  # TabBar 样式
│   └── Layout.js          # 布局组件
├── pages/
│   ├── index.js           # 首页
│   ├── service.js         # 服务页面
│   ├── message.js         # 消息页面
│   ├── profile.js         # 个人中心
│   ├── _app.js            # 应用入口
│   └── posts/
│       └── first-post.js  # 示例文章页面
├── styles/
│   └── globals.css        # 全局样式
└── public/               # 静态资源
```

## 开始使用

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

## 技术栈

- **Next.js 15** - React 框架
- **React 18** - UI 库
- **CSS Modules** - 样式解决方案
- **Tailwind CSS** - CSS 框架
- **响应式设计** - 移动端适配

## 路由说明

### 主要页面路由
- `/` - 首页（默认激活）
- `/service` - 服务页面
- `/message` - 消息页面
- `/profile` - 个人中心页面

### TabBar 导航
TabBar 组件会自动根据当前路由高亮对应的选项卡，支持：
- 点击切换页面
- 路由状态同步
- 视觉反馈效果

## 自定义开发

### 添加新页面
1. 在 `pages/` 目录下创建新的页面文件
2. 在 `TabBar.js` 中添加新的导航项
3. 更新路由配置

### 修改样式
- 全局样式：编辑 `styles/globals.css`
- TabBar 样式：编辑 `components/TabBar.module.css`
- 页面样式：使用内联样式或 CSS Modules

### 组件开发
- 所有可复用组件放在 `components/` 目录
- 使用 CSS Modules 进行样式隔离
- 遵循 React 最佳实践

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端浏览器

## 许可证

MIT License
