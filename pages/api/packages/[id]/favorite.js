import connectDB from '../../../../lib/mongodb';
import Package from '../../../../models/Package';

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

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({
      success: false,
      message: `方法 ${method} 不被允许`
    });
  }

  try {
    const { isFavorite } = req.body;
    
    if (typeof isFavorite !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isFavorite 必须是布尔值'
      });
    }
    
    const pkg = await Package.findByIdAndUpdate(
      id,
      { isFavorite },
      { new: true }
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
      message: isFavorite ? '已添加到收藏' : '已取消收藏'
    });
  } catch (error) {
    console.error('更新收藏状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新收藏状态失败',
      error: error.message
    });
  }
} 