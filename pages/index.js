import Link from 'next/link';
import TabBar from '../components/TabBar';
import styles from '../components/TabBar.module.css';

export default function Home() {
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
            placeholder="搜索商品、服务..." 
            style={{ 
              border: 'none', 
              outline: 'none', 
              flex: 1, 
              fontSize: '14px' 
            }} 
          />
        </div>
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
          <Link href="/posts/first-post" style={{
            background: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            示例页面
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
            查看服务
          </Link>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
