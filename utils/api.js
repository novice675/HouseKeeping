// API基础配置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : '/api';

// 通用请求函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API请求失败 ${endpoint}:`, error);
    throw error;
  }
}

// 套餐相关API
export const packageAPI = {
  // 获取套餐列表
  getPackages: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/packages?${searchParams}`);
  },

  // 获取套餐详情
  getPackage: (id) => {
    return apiRequest(`/packages/${id}`);
  },

  // 创建套餐
  createPackage: (packageData) => {
    return apiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData)
    });
  },

  // 更新套餐
  updatePackage: (id, packageData) => {
    return apiRequest(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData)
    });
  },

  // 删除套餐
  deletePackage: (id) => {
    return apiRequest(`/packages/${id}`, {
      method: 'DELETE'
    });
  },

  // 切换收藏状态
  toggleFavorite: (id, isFavorite) => {
    return apiRequest(`/packages/${id}/favorite`, {
      method: 'PUT',
      body: JSON.stringify({ isFavorite })
    });
  }
};

// 工具函数
export const utils = {
  // 格式化价格
  formatPrice: (price) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price);
  },

  // 格式化数字（销量等）
  formatNumber: (number) => {
    if (number >= 10000) {
      return `${(number / 10000).toFixed(1)}万`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
  },

  // 截取描述文本
  truncateText: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  // 获取好评率文本
  getRatingText: (positiveRate) => {
    if (positiveRate >= 95) return '好评如潮';
    if (positiveRate >= 90) return '好评';
    if (positiveRate >= 80) return '中评';
    return '差评';
  },

  // 获取好评率颜色
  getRatingColor: (positiveRate) => {
    if (positiveRate >= 90) return '#10b981';
    if (positiveRate >= 80) return '#f59e0b';
    return '#ef4444';
  }
}; 