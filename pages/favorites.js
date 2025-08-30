import { useState } from 'react';
import TabBar from '../components/TabBar';
import PackageCard from '../components/PackageCard';
import { usePackages } from '../hooks/usePackages';
import styles from '../components/TabBar.module.css';

export default function Favorites() {
  const { packages, loading, error, refetch } = usePackages();
  
  // 筛选出收藏的套餐
  const favoritePackages = packages.filter(pkg => pkg.isFavorite);

  const handlePackageUpdate = (packageId, updates) => {
    // 如果取消收藏，重新获取数据来更新列表
    if (updates.isFavorite === false) {
      refetch();
    }
  };

  return (
    <div className={styles.pageContent}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
        padding: '20px', 
        color: 'white' 
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>我的收藏</h1>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>管理您收藏的套餐</p>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: '20px' }}>
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

        {/* 收藏列表 */}
        {!loading && favoritePackages.length > 0 && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                收藏的套餐
              </h2>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                共 {favoritePackages.length} 个
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {favoritePackages.map((pkg) => (
                <PackageCard 
                  key={pkg._id} 
                  package={pkg} 
                  onUpdate={handlePackageUpdate}
                />
              ))}
            </div>
          </>
        )}

        {/* 无收藏状态 */}
        {!loading && favoritePackages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💝</div>
            <h3 style={{ margin: '0 0 8px', color: '#374151' }}>暂无收藏</h3>
            <p style={{ margin: '0 0 20px', color: '#6b7280' }}>
              去服务页面收藏一些您感兴趣的套餐吧
            </p>
            <a
              href="/service"
              style={{
                background: '#f59e0b',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              浏览套餐
            </a>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
} 