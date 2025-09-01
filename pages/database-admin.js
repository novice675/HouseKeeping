import { useState } from 'react';

export default function DatabaseAdmin() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('检查状态失败:', error);
      setStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const initDatabase = async () => {
    setInitLoading(true);
    try {
      const response = await fetch('/api/database/init', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('数据库初始化成功！');
        // 重新检查状态
        await checkStatus();
      } else {
        alert('初始化失败: ' + data.message);
      }
    } catch (error) {
      console.error('初始化失败:', error);
      alert('初始化失败: ' + error.message);
    } finally {
      setInitLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '40px'
      }}>
        🗄️ 数据库管理控制台
      </h1>

      <div style={{ 
        display: 'grid', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <button
          onClick={checkStatus}
          disabled={loading}
          style={{
            padding: '15px 30px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '检查中...' : '🔍 检查数据库状态'}
        </button>

        <button
          onClick={initDatabase}
          disabled={initLoading}
          style={{
            padding: '15px 30px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: initLoading ? 'not-allowed' : 'pointer',
            opacity: initLoading ? 0.6 : 1
          }}
        >
          {initLoading ? '初始化中...' : '🚀 初始化数据库'}
        </button>
      </div>

      {status && (
        <div style={{
          background: status.success ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${status.success ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ 
            color: status.success ? '#166534' : '#dc2626',
            marginTop: 0
          }}>
            {status.success ? '✅ 连接成功' : '❌ 连接失败'}
          </h2>

          {status.success && status.data && (
            <div style={{ color: '#374151' }}>
              <p><strong>数据库名称:</strong> {status.data.databaseName}</p>
              <p><strong>套餐数量:</strong> {status.data.packageCount}</p>
              
              <h3>集合列表:</h3>
              <ul>
                {status.data.collections.length > 0 ? 
                  status.data.collections.map((collection, index) => (
                    <li key={index}>
                      {collection.name} ({collection.type})
                    </li>
                  )) : 
                  <li style={{ color: '#6b7280' }}>暂无集合</li>
                }
              </ul>

              {status.data.databaseStats && (
                <div>
                  <h3>数据库统计:</h3>
                  <ul>
                    <li>集合数量: {status.data.databaseStats.collections}</li>
                    <li>数据大小: {(status.data.databaseStats.dataSize / 1024).toFixed(2)} KB</li>
                    <li>存储大小: {(status.data.databaseStats.storageSize / 1024).toFixed(2)} KB</li>
                    <li>索引数量: {status.data.databaseStats.indexes}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {!status.success && (
            <div style={{ color: '#dc2626' }}>
              <p><strong>错误信息:</strong> {status.message || status.error}</p>
              {status.error && <pre style={{ background: '#fef2f2', padding: '10px', borderRadius: '4px' }}>{status.error}</pre>}
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h3>📝 说明</h3>
        <ul style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <li><strong>检查数据库状态</strong>: 查看数据库连接状态、集合列表和统计信息</li>
          <li><strong>初始化数据库</strong>: 创建示例套餐数据，这将创建 "packages" 集合</li>
          <li>MongoDB 使用懒创建机制，只有插入数据时才会创建集合</li>
          <li>初始化后，您可以在服务页面看到套餐数据</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <a 
          href="/service"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '16px'
          }}
        >
          ← 返回服务页面
        </a>
      </div>
    </div>
  );
} 