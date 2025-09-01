import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  // 套餐名称
  name: {
    type: String,
    required: [true, '套餐名称不能为空'],
    trim: true,
    maxlength: [100, '套餐名称不能超过100个字符']
  },
  
  // 单价
  price: {
    type: Number,
    required: [true, '价格不能为空'],
    min: [0, '价格不能为负数']
  },
  
  // 描述
  description: {
    type: String,
    required: [true, '描述不能为空'],
    trim: true,
    maxlength: [1000, '描述不能超过1000个字符']
  },
  
  // 销量
  salesCount: {
    type: Number,
    default: 0,
    min: [0, '销量不能为负数']
  },
  
  // 是否收藏
  isFavorite: {
    type: Boolean,
    default: false
  },
  
  // 好评个数
  positiveReviews: {
    type: Number,
    default: 0,
    min: [0, '好评数不能为负数']
  },
  
  // 总评论数
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, '总评论数不能为负数']
  },
  
  // 图片URL
  imageUrl: {
    type: String,
    default: ''
  },
  
  // 分类
  category: {
    type: String,
    enum: ['基础套餐', '进阶套餐', '高级套餐', '定制套餐'],
    default: '基础套餐'
  },
  
  // 状态（上架/下架）
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // 标签
  tags: [{
    type: String
  }],
  
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 添加虚拟字段：好评率
PackageSchema.virtual('positiveRate').get(function() {
  if (this.totalReviews === 0) return 0;
  return Math.round((this.positiveReviews / this.totalReviews) * 100);
});

// 确保虚拟字段在JSON序列化时包含
PackageSchema.set('toJSON', { virtuals: true });

// 更新时间中间件
PackageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 避免重复编译模型
export default mongoose.models.Package || mongoose.model('Package', PackageSchema); 