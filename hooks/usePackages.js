import { useState, useEffect } from 'react';

// 获取套餐列表的Hook
export function usePackages(filters = {}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchPackages = async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        ...filters,
        ...newFilters
      });
      
      const response = await fetch(`/api/packages?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || '获取套餐列表失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
      console.error('获取套餐列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    error,
    pagination,
    refetch: fetchPackages
  };
}

// 获取单个套餐详情的Hook
export function usePackage(id) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/packages/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setPkg(data.data);
        } else {
          setError(data.message || '获取套餐详情失败');
        }
      } catch (err) {
        setError('网络错误，请重试');
        console.error('获取套餐详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  return { package: pkg, loading, error };
}

// 更新收藏状态的Hook
export function useFavorite() {
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (packageId, isFavorite) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/packages/${packageId}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFavorite })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || '更新收藏状态失败');
      }
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { toggleFavorite, loading };
} 