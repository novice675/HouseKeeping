// 应用路由配置
export const routes = {
  HOME: '/',
  SERVICE: '/service',
  MESSAGE: '/message',
  PROFILE: '/profile',
<<<<<<< HEAD
  FIRST_POST: '/posts/first-post',
  YJL: '/YJL',
=======
  FAVORITES: '/favorites',
  FIRST_POST: '/posts/first-post'
>>>>>>> 58d0980d5a56ccfa37a409dd474506e952017e53
};

// TabBar 导航配置
export const tabBarConfig = [
  { 
    key: 'home', 
    label: '首页', 
    path: routes.HOME, 
    icon: '🏠',
    activeColor: '#3b82f6'
  },
  { 
    key: 'service', 
    label: '服务', 
    path: routes.SERVICE, 
    icon: '🛠️',
    activeColor: '#10b981'
  },
  { 
    key: 'message', 
    label: '消息', 
    path: routes.MESSAGE, 
    icon: '💬',
    activeColor: '#f59e0b'
  },
  { 
    key: 'profile', 
    label: '我的', 
    path: routes.PROFILE, 
    icon: '👤',
    activeColor: '#8b5cf6'
  }
];

// 获取当前激活的标签页
export function getActiveTab(pathname) {
  if (pathname === routes.HOME) return 'home';
  if (pathname === routes.SERVICE) return 'service';
  if (pathname === routes.MESSAGE) return 'message';
  if (pathname === routes.PROFILE) return 'profile';
  return 'home'; // 默认激活首页
}

// 页面标题配置
export const pageTitles = {
  [routes.HOME]: '首页',
  [routes.SERVICE]: '服务',
  [routes.MESSAGE]: '消息',
  [routes.PROFILE]: '我的',
  [routes.FAVORITES]: '收藏',
  [routes.FIRST_POST]: '第一篇文章'
}; 