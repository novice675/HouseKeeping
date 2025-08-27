import TabBar from '../components/TabBar';
import styles from '../components/TabBar.module.css';

export default function Service() {
  return (
    <div className={styles.pageContent}>
      <div style={{ padding: '20px' }}>
        <h1>服务页面</h1>
        <div style={{ marginTop: '20px' }}>
          <h2>我们的服务</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📞</div>
              <h3>客服支持</h3>
              <p>24小时在线客服</p>
            </div>
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🚚</div>
              <h3>快速配送</h3>
              <p>当日达服务</p>
            </div>
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔧</div>
              <h3>技术支持</h3>
              <p>专业技术团队</p>
            </div>
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>💎</div>
              <h3>VIP服务</h3>
              <p>尊享专属服务</p>
            </div>
          </div>
        </div>
      </div>
      <TabBar />
    </div>
  );
} 