import TabBar from '../components/TabBar';
import styles from '../components/TabBar.module.css';

export default function Message() {
  const messages = [
    { id: 1, title: '系统通知', content: '欢迎使用我们的应用！', time: '2024-01-15 10:30', read: false },
    { id: 2, title: '活动提醒', content: '新年特惠活动正在进行中', time: '2024-01-14 16:20', read: true },
    { id: 3, title: '订单状态', content: '您的订单已发货', time: '2024-01-13 09:15', read: true },
  ];

  return (
    <div className={styles.pageContent}>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>消息</h1>
          <button style={{ backgroundColor: '#3b82f6', color: '#fff',
             padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
             onClick={() => {
              window.location.href = '/YJL';
             }}
             >
          客服对话
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          {messages.map((message) => (
            <div key={message.id} style={{
              padding: '15px',
              background: message.read ? '#ffffff' : '#f0f8ff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              marginBottom: '10px',
              borderLeft: message.read ? '3px solid #e5e5e5' : '3px solid #3b82f6'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '16px',
                  fontWeight: message.read ? 'normal' : 'bold'
                }}>
                  {message.title}
                  {!message.read && <span style={{ 
                    color: '#ff4757', 
                    fontSize: '12px', 
                    marginLeft: '5px' 
                  }}>●</span>}
                </h3>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  whiteSpace: 'nowrap'
                }}>
                  {message.time}
                </span>
              </div>
              <p style={{ 
                margin: 0, 
                color: '#666',
                fontSize: '14px'
              }}>
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <TabBar />
    </div>
  );
} 