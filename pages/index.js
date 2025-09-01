import { useState } from 'react';
import Link from 'next/link';
import TabBar from '../components/TabBar';
import PackageCard from '../components/PackageCard';
import { usePackages } from '../hooks/usePackages';
import styles from '../components/TabBar.module.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { packages, loading, error, refetch } = usePackages();

  // 获取热门套餐（按销量排序，取前6个）
  const popularPackages = packages
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 6);

  const features = [
    { icon: '🛒', title: '购物商城', desc: '精选商品，品质保证' },
    { icon: '💳', title: '便捷支付', desc: '多种支付方式' },
    { icon: '🚚', title: '快速配送', desc: '当日达，次日达' },
    { icon: '🔒', title: '安全保障', desc: '交易安全可靠' }
  ];

  const banners = [
    { id: 1, title: '新年特惠', subtitle: '全场5折起', bgColor: '#ff6b6b' },
    { id: 2, title: '限时抢购', subtitle: '好货不等人', bgColor: '#4ecdc4' },
    { id: 3, title: 'VIP专享', subtitle: '会员独享福利', bgColor: '#45b7d1' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳转到服务页面并携带搜索参数
      window.location.href = `/service?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handlePackageUpdate = (packageId, updates) => {
    // 重新获取数据以更新UI
    refetch();
  };

  const handleInitData = async () => {
    try {
      const response = await fetch('/api/database/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clearExisting: false })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`✅ 数据初始化成功！\n创建了 ${data.data.packagesCreated} 个套餐`);
        refetch();
      } else {
        alert('❌ 初始化失败: ' + data.message);
      }
    } catch (error) {
      console.error('初始化失败:', error);
      alert('❌ 初始化失败: ' + error.message);
    }
  };

  return (
    <div className={styles.pageContent}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '20px', 
        color: 'white' 
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>欢迎回来！</h1>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>探索更多精彩内容</p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '15px 20px', background: '#f8f9fa' }}>
        <form onSubmit={handleSearchSubmit}>
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
              placeholder="搜索套餐、服务..." 
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
        </form>
      </div>

      {/* Banner */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {banners.map((banner) => (
            <div key={banner.id} style={{
              minWidth: '200px',
              height: '100px',
              background: banner.bgColor,
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{banner.title}</h3>
              <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.9 }}>{banner.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 热门套餐展示 */}
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>🔥 热门套餐</h2>
          <Link href="/service" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            查看全部 →
          </Link>
        </div>

        {/* 如果没有数据，显示初始化按钮 */}
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
              点击下方按钮初始化一些精彩的套餐数据
            </p>
            <button
              onClick={handleInitData}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              初始化套餐数据
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
            padding: '20px',
            color: '#dc2626',
            background: '#fef2f2',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <p>❌ {error}</p>
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

        {/* 套餐卡片展示 */}
        {!loading && popularPackages.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {popularPackages.map((pkg) => (
              <PackageCard 
                key={pkg._id} 
                package={pkg} 
                onUpdate={handlePackageUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ padding: '20px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 'bold' }}>核心功能</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '15px' 
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{feature.icon}</div>
              <h3 style={{ margin: '0 0 5px', fontSize: '16px', fontWeight: 'bold' }}>{feature.title}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ margin: '0 0 15px', fontSize: '20px', fontWeight: 'bold' }}>快速链接</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/database-admin" style={{
            background: '#8b5cf6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            数据库管理
          </Link>
          <Link href="/service" style={{
            background: '#10b981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            全部服务
          </Link>
          <Link href="/favorites" style={{
            background: '#f59e0b',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            我的收藏
          </Link>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
