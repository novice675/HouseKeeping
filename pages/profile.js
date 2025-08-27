import TabBar from '../components/TabBar';
import styles from '../components/TabBar.module.css';

export default function Profile() {
  const menuItems = [
    { icon: '👤', title: '个人信息', subtitle: '编辑个人资料' },
    { icon: '📋', title: '我的订单', subtitle: '查看订单历史' },
    { icon: '❤️', title: '我的收藏', subtitle: '收藏的商品' },
    { icon: '🎯', title: '积分中心', subtitle: '查看积分余额' },
    { icon: '📍', title: '地址管理', subtitle: '管理收货地址' },
    { icon: '⚙️', title: '设置', subtitle: '应用设置' },
    { icon: '📞', title: '联系客服', subtitle: '在线客服支持' },
    { icon: 'ℹ️', title: '关于我们', subtitle: '了解更多信息' },
  ];

  return (
    <div className={styles.pageContent}>
      <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '30px 20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginRight: '15px'
          }}>
            👤
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>用户名</h2>
            <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '14px' }}>ID: 123456789</p>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '30px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>0</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>待付款</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>0</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>待发货</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>0</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>待收货</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>0</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>待评价</div>
          </div>
        </div>

        <div>
          {menuItems.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '20px', marginRight: '15px', width: '30px' }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{item.subtitle}</div>
              </div>
              <div style={{ fontSize: '14px', color: '#ccc' }}>›</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar />
    </div>
  );
} 