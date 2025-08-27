import Link from 'next/link';
import TabBar from '../../components/TabBar';
import styles from '../../components/TabBar.module.css';

export default function FirstPost() {
  return (
    <div className={styles.pageContent}>
      <div style={{ padding: '20px' }}>
        <h1>第一篇文章</h1>
        <p style={{ margin: '20px 0', lineHeight: '1.6', color: '#666' }}>
          这是一个示例页面，展示了Next.js的页面路由功能。
          你可以通过底部的TabBar导航到其他页面，也可以使用下面的链接返回首页。
        </p>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px 0',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px', color: '#333' }}>页面功能说明</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li>响应式设计，适配移动端和桌面端</li>
            <li>底部TabBar固定导航</li>
            <li>页面间无刷新跳转</li>
            <li>统一的页面布局和样式</li>
          </ul>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>快速导航</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Link href="/" style={{
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              ← 返回首页
            </Link>
            <Link href="/service" style={{
              background: '#10b981',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              查看服务
            </Link>
            <Link href="/message" style={{
              background: '#f59e0b',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              消息中心
            </Link>
            <Link href="/profile" style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              个人中心
            </Link>
          </div>
        </div>
      </div>
      <TabBar />
    </div>
  );
}