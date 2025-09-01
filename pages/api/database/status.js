import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: '只允许GET方法' 
    });
  }

  try {
    // 连接数据库
    await connectDB();

    // 获取数据库信息
    const dbName = Package.db.db.databaseName;
    
    // 获取所有集合
    const collections = await Package.db.db.listCollections().toArray();
    
    // 获取套餐数量
    const packageCount = await Package.countDocuments();
    
    // 获取数据库统计信息
    const stats = await Package.db.db.stats();

    res.status(200).json({
      success: true,
      data: {
        connected: true,
        databaseName: dbName,
        collections: collections.map(c => ({
          name: c.name,
          type: c.type
        })),
        packageCount,
        databaseStats: {
          collections: stats.collections,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          indexes: stats.indexes
        }
      }
    });

  } catch (error) {
    console.error('❌ 数据库状态检查失败:', error);
    res.status(500).json({
      success: false,
      message: '数据库状态检查失败',
      error: error.message,
      connected: false
    });
  }
} 