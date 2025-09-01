import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';

// 连接数据库
connectDB();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // 获取查询参数
        const { category, status = 'active', page = 1, limit = 10, search } = req.query;
        
        // 构建查询条件
        const query = { status };
        
        if (category && category !== 'all') {
          query.category = category;
        }
        
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        
        // 分页计算
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // 执行查询
        const packages = await Package.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean();
        
        // 获取总数
        const total = await Package.countDocuments(query);
        
        res.status(200).json({
          success: true,
          data: packages,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        });
      } catch (error) {
        console.error('获取套餐列表失败:', error);
        res.status(500).json({
          success: false,
          message: '获取套餐列表失败',
          error: error.message
        });
      }
      break;

    case 'POST':
      try {
        const packageData = req.body;
        
        // 创建新套餐
        const newPackage = new Package(packageData);
        const savedPackage = await newPackage.save();
        
        res.status(201).json({
          success: true,
          data: savedPackage,
          message: '套餐创建成功'
        });
      } catch (error) {
        console.error('创建套餐失败:', error);
        
        // 处理验证错误
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({
            success: false,
            message: '数据验证失败',
            errors: validationErrors
          });
        }
        
        res.status(500).json({
          success: false,
          message: '创建套餐失败',
          error: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `方法 ${method} 不被允许`
      });
      break;
  }
} 