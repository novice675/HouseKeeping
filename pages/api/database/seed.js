import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { generateMockPackages } from '../../../utils/mockData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: '只允许POST方法' 
    });
  }

  try {
    // 连接数据库
    await connectDB();
    console.log('🔗 正在连接数据库...');

    // 检查是否需要清空现有数据
    const { clearExisting = false } = req.body;
    
    if (clearExisting) {
      await Package.deleteMany({});
      console.log('🧹 已清空现有数据');
    }

    // 生成模拟数据
    const mockPackages = generateMockPackages();
    console.log('📦 生成了', mockPackages.length, '个套餐数据');

    // 批量插入数据
    const createdPackages = await Package.insertMany(mockPackages);
    console.log('✅ 成功插入', createdPackages.length, '个套餐');

    // 统计插入的数据
    const totalCount = await Package.countDocuments();
    const categoryStats = await Package.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalSales: { $sum: '$salesCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const favoriteCount = await Package.countDocuments({ isFavorite: true });

    res.status(200).json({
      success: true,
      message: '模拟数据生成成功',
      data: {
        packagesCreated: createdPackages.length,
        totalPackages: totalCount,
        favoritePackages: favoriteCount,
        categoryStats: categoryStats,
        samplePackages: createdPackages.slice(0, 3).map(pkg => ({
          id: pkg._id,
          name: pkg.name,
          price: pkg.price,
          category: pkg.category,
          salesCount: pkg.salesCount
        }))
      }
    });

  } catch (error) {
    console.error('❌ 数据生成失败:', error);
    res.status(500).json({
      success: false,
      message: '数据生成失败',
      error: error.message
    });
  }
} 