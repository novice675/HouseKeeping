import { useState, useEffect } from 'react';
import TabBar from '../components/TabBar';
import PackageCard from '../components/PackageCard';
import { usePackages } from '../hooks/usePackages';
import styles from '../components/TabBar.module.css';

export default function Service() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { packages, loading, error, refetch } = usePackages();
  
  const categories = [
    { key: 'all', label: '全部' },
    { key: '基础套餐', label: '基础套餐' },
    { key: '进阶套餐', label: '进阶套餐' },
    { key: '高级套餐', label: '高级套餐' },
    { key: '定制套餐', label: '定制套餐' }
  ];

  // 筛选套餐
  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
    const matchesSearch = !searchQuery || 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePackageUpdate = (packageId, updates) => {
    // 可以在这里更新本地状态或重新获取数据
    console.log('套餐更新:', packageId, updates);
  };

  const handleAddDemoData = async () => {
    try {
      const demoPackages = [
        {
          name: '基础云服务套餐',
          price: 299,
          description: '提供基础的云计算服务，包含虚拟主机、数据库、CDN加速等基础功能，适合小型网站和应用使用。',
          category: '基础套餐',
          salesCount: 1250,
          positiveReviews: 1180,
          totalReviews: 1250,
          tags: ['云服务', '虚拟主机', 'CDN'],
          imageUrl: ''
        },
        {
          name: '进阶企业解决方案',
          price: 899,
          description: '面向中小企业的综合解决方案，包含高性能服务器、专业技术支持、安全防护、数据备份等服务。',
          category: '进阶套餐',
          salesCount: 856,
          positiveReviews: 820,
          totalReviews: 856,
          tags: ['企业级', '技术支持', '安全防护'],
          imageUrl: ''
        },
        {
          name: '高级定制开发',
          price: 2999,
          description: '提供专业的定制开发服务，包含需求分析、UI设计、前后端开发、测试部署、运维支持等全流程服务。',
          category: '高级套餐',
          salesCount: 234,
          positiveReviews: 228,
          totalReviews: 234,
          tags: ['定制开发', '全流程', 'UI设计'],
          imageUrl: ''
        }
      ];

      for (const pkg of demoPackages) {
        await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pkg)
        });
      }
      
      // 重新获取数据
      refetch();
      alert('演示数据添加成功！');
    } catch (error) {
      console.error('添加演示数据失败:', error);
      alert('添加演示数据失败');
    }
  };

  return (
    <div className={styles.pageContent}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
        padding: '20px', 
        color: 'white' 
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>服务套餐</h1>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>选择适合您的服务方案</p>
      </div>

      {/* 搜索栏 */}
      <div style={{ padding: '15px 20px', background: '#f8f9fa' }}>
        <div style={{
          background: 'white',
          borderRadius: '25px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <span style={{ marginRight: '10px', color: '#666' }}>🔍</span>
          <input 
            type="text" 
            placeholder="搜索套餐..." 
            value={searchQuery}
            onChange={handleSearch}
            style={{ 
              border: 'none', 
              outline: 'none', 
              flex: 1, 
              fontSize: '14px' 
            }} 
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div style={{ padding: '10px 20px', background: 'white', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                background: activeCategory === category.key ? '#10b981' : '#f3f4f6',
                color: activeCategory === category.key ? 'white' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: '20px' }}>
        {/* 如果没有数据，显示添加演示数据的按钮 */}
        {!loading && packages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ margin: '0 0 8px', color: '#374151' }}>暂无套餐数据</h3>
            <p style={{ margin: '0 0 20px', color: '#6b7280' }}>
              点击下方按钮添加一些演示数据来体验功能
            </p>
            <button
              onClick={handleAddDemoData}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              添加演示数据
            </button>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            加载中...
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#dc2626',
            background: '#fef2f2',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
            <p>{error}</p>
            <button
              onClick={() => refetch()}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              重试
            </button>
          </div>
        )}

        {/* 套餐列表 */}
        {!loading && filteredPackages.length > 0 && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {activeCategory === 'all' ? '全部套餐' : activeCategory}
              </h2>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                共 {filteredPackages.length} 个套餐
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {filteredPackages.map((pkg) => (
                <PackageCard 
                  key={pkg._id} 
                  package={pkg} 
                  onUpdate={handlePackageUpdate}
                />
              ))}
            </div>
          </>
        )}

        {/* 搜索无结果 */}
        {!loading && packages.length > 0 && filteredPackages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ margin: '0 0 8px' }}>未找到相关套餐</h3>
            <p style={{ margin: 0 }}>
              尝试调整搜索条件或选择其他分类
            </p>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
} 