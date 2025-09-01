import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';

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

    // 检查集合是否存在
    const collections = await Package.db.db.listCollections().toArray();
    console.log('📋 现有集合:', collections.map(c => c.name));

    // 创建示例数据来初始化集合
    const samplePackages = [
      {
        name: '基础云服务套餐',
        price: 299,
        description: '提供基础的云计算服务，包含虚拟主机、数据库、CDN加速等基础功能，适合小型网站和应用使用。支持99.9%的服务可用性保证，24小时技术支持，适合初创企业和个人开发者。',
        category: '基础套餐',
        salesCount: 1250,
        positiveReviews: 1180,
        totalReviews: 1250,
        tags: ['云服务', '虚拟主机', 'CDN', '数据库'],
        imageUrl: '',
        status: 'active'
      },
      {
        name: '进阶企业解决方案',
        price: 899,
        description: '面向中小企业的综合解决方案，包含高性能服务器、专业技术支持、安全防护、数据备份等服务。提供负载均衡、自动扩容、监控报警等高级功能，保障业务稳定运行。',
        category: '进阶套餐',
        salesCount: 856,
        positiveReviews: 820,
        totalReviews: 856,
        tags: ['企业级', '技术支持', '安全防护', '负载均衡'],
        imageUrl: '',
        status: 'active'
      },
      {
        name: '高级定制开发',
        price: 2999,
        description: '提供专业的定制开发服务，包含需求分析、UI设计、前后端开发、测试部署、运维支持等全流程服务。配备专业项目经理和技术团队，确保项目按时交付。',
        category: '高级套餐',
        salesCount: 234,
        positiveReviews: 228,
        totalReviews: 234,
        tags: ['定制开发', '全流程', 'UI设计', '项目管理'],
        imageUrl: '',
        status: 'active'
      },
      {
        name: '企业级定制方案',
        price: 5999,
        description: '为大型企业提供完全定制化的解决方案，包含架构设计、系统集成、安全审计、性能优化等服务。提供7x24小时专属技术支持，保障企业关键业务。',
        category: '定制套餐',
        salesCount: 89,
        positiveReviews: 87,
        totalReviews: 89,
        tags: ['企业级', '定制化', '架构设计', '专属支持'],
        imageUrl: '',
        status: 'active'
      }
    ];

    // 清空现有数据（如果存在）
    await Package.deleteMany({});
    console.log('🧹 清空现有数据');

    // 插入示例数据
    const createdPackages = await Package.insertMany(samplePackages);
    console.log('✅ 成功创建', createdPackages.length, '个套餐');

    // 验证数据插入
    const count = await Package.countDocuments();
    console.log('📊 数据库中套餐总数:', count);

    // 再次检查集合
    const newCollections = await Package.db.db.listCollections().toArray();
    console.log('📋 更新后的集合:', newCollections.map(c => c.name));

    res.status(200).json({
      success: true,
      message: '数据库初始化成功',
      data: {
        packagesCreated: createdPackages.length,
        totalPackages: count,
        collections: newCollections.map(c => c.name)
      }
    });

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    res.status(500).json({
      success: false,
      message: '数据库初始化失败',
      error: error.message
    });
  }
} 