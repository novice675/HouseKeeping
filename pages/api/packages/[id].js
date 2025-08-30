import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';

// 连接数据库
connectDB();

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  // 验证ID格式
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: '无效的套餐ID'
    });
  }

  switch (method) {
    case 'GET':
      try {
        const pkg = await Package.findById(id);
        
        if (!pkg) {
          return res.status(404).json({
            success: false,
            message: '套餐不存在'
          });
        }
        
        res.status(200).json({
          success: true,
          data: pkg
        });
      } catch (error) {
        console.error('获取套餐详情失败:', error);
        res.status(500).json({
          success: false,
          message: '获取套餐详情失败',
          error: error.message
        });
      }
      break;

    case 'PUT':
      try {
        const updateData = req.body;
        
        const pkg = await Package.findByIdAndUpdate(
          id,
          updateData,
          { 
            new: true, 
            runValidators: true 
          }
        );
        
        if (!pkg) {
          return res.status(404).json({
            success: false,
            message: '套餐不存在'
          });
        }
        
        res.status(200).json({
          success: true,
          data: pkg,
          message: '套餐更新成功'
        });
      } catch (error) {
        console.error('更新套餐失败:', error);
        
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
          message: '更新套餐失败',
          error: error.message
        });
      }
      break;

    case 'DELETE':
      try {
        const pkg = await Package.findByIdAndDelete(id);
        
        if (!pkg) {
          return res.status(404).json({
            success: false,
            message: '套餐不存在'
          });
        }
        
        res.status(200).json({
          success: true,
          message: '套餐删除成功'
        });
      } catch (error) {
        console.error('删除套餐失败:', error);
        res.status(500).json({
          success: false,
          message: '删除套餐失败',
          error: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `方法 ${method} 不被允许`
      });
      break;
  }
} 