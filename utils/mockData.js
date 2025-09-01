// 套餐模拟数据生成器
export const generateMockPackages = () => {
  const packages = [
    // 基础套餐
    {
      name: '云端起步套餐',
      price: 199,
      description: '适合个人开发者和小型项目的入门级云服务套餐。包含1核CPU、2GB内存、50GB SSD存储、100GB月流量。提供基础的Web应用托管、数据库服务和CDN加速，支持自动备份和基础监控。',
      category: '基础套餐',
      salesCount: 2156,
      positiveReviews: 2089,
      totalReviews: 2156,
      tags: ['云服务', '个人开发', 'Web托管', '数据库'],
      imageUrl: '',
      status: 'active',
      isFavorite: true
    },
    {
      name: '学生专享套餐',
      price: 99,
      description: '专为在校学生设计的超值云服务套餐。提供基础的开发环境，包含代码托管、小型数据库、静态网站部署等功能。支持多种编程语言，适合学习和课程项目开发。',
      category: '基础套餐',
      salesCount: 3421,
      positiveReviews: 3298,
      totalReviews: 3421,
      tags: ['学生优惠', '学习开发', '代码托管', '教育'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '博客建站套餐',
      price: 259,
      description: '专门为个人博客和内容创作者设计的建站套餐。集成WordPress、Ghost等主流博客系统，提供域名解析、SSL证书、CDN加速、SEO优化工具。一键部署，零技术门槛。',
      category: '基础套餐',
      salesCount: 1876,
      positiveReviews: 1789,
      totalReviews: 1876,
      tags: ['博客', 'WordPress', 'SEO优化', '内容创作'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '小程序开发套餐',
      price: 399,
      description: '面向小程序开发的专业套餐。提供微信小程序、支付宝小程序开发所需的后端API服务、数据库、文件存储、推送服务等。包含开发工具链和测试环境。',
      category: '基础套餐',
      salesCount: 1543,
      positiveReviews: 1487,
      totalReviews: 1543,
      tags: ['小程序', '微信开发', 'API服务', '移动开发'],
      imageUrl: '',
      status: 'active'
    },

    // 进阶套餐
    {
      name: '企业标准套餐',
      price: 899,
      description: '为中小企业量身定制的标准云服务方案。4核CPU、8GB内存、200GB SSD存储、500GB月流量。包含负载均衡、自动扩容、数据备份、安全防护、7x24小时技术支持。适合企业官网、OA系统等应用。',
      category: '进阶套餐',
      salesCount: 1234,
      positiveReviews: 1198,
      totalReviews: 1234,
      tags: ['企业级', '负载均衡', '技术支持', '安全防护'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '电商解决方案',
      price: 1299,
      description: '专为电商平台设计的综合解决方案。包含商品管理、订单处理、支付集成、库存管理、用户系统、营销工具等完整功能模块。支持多种支付方式，提供数据分析和运营报表。',
      category: '进阶套餐',
      salesCount: 876,
      positiveReviews: 845,
      totalReviews: 876,
      tags: ['电商平台', '支付集成', '库存管理', '数据分析'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '移动应用后端',
      price: 1599,
      description: '为iOS、Android应用提供强大后端支持的套餐。包含用户认证、数据同步、推送通知、文件存储、实时聊天、地理位置服务等功能。支持高并发，保障移动应用稳定运行。',
      category: '进阶套餐',
      salesCount: 654,
      positiveReviews: 628,
      totalReviews: 654,
      tags: ['移动应用', '用户认证', '推送通知', '实时聊天'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '数据分析平台',
      price: 2199,
      description: '专业的数据收集、处理和分析平台。提供实时数据采集、ETL处理、数据仓库、可视化报表、机器学习算法等功能。支持多种数据源接入，助力企业数据驱动决策。',
      category: '进阶套餐',
      salesCount: 432,
      positiveReviews: 421,
      totalReviews: 432,
      tags: ['数据分析', '机器学习', '可视化', 'ETL处理'],
      imageUrl: '',
      status: 'active'
    },

    // 高级套餐
    {
      name: '企业级云原生',
      price: 3999,
      description: '基于Kubernetes的企业级云原生解决方案。16核CPU、32GB内存、1TB SSD存储、不限流量。包含容器编排、微服务架构、DevOps工具链、监控告警、灾备恢复等全套企业级功能。',
      category: '高级套餐',
      salesCount: 298,
      positiveReviews: 289,
      totalReviews: 298,
      tags: ['云原生', 'Kubernetes', '微服务', 'DevOps'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: 'AI智能开发平台',
      price: 4999,
      description: '集成人工智能能力的开发平台。提供机器学习模型训练、深度学习框架、GPU计算资源、AI模型部署、智能API服务等功能。支持TensorFlow、PyTorch等主流框架。',
      category: '高级套餐',
      salesCount: 156,
      positiveReviews: 152,
      totalReviews: 156,
      tags: ['人工智能', '机器学习', 'GPU计算', '深度学习'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '区块链应用平台',
      price: 5999,
      description: '专业的区块链应用开发和部署平台。支持以太坊、比特币、Hyperledger等主流区块链网络。提供智能合约开发、DApp部署、数字资产管理、去中心化身份认证等服务。',
      category: '高级套餐',
      salesCount: 89,
      positiveReviews: 86,
      totalReviews: 89,
      tags: ['区块链', '智能合约', 'DApp', '数字资产'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '大数据处理引擎',
      price: 6999,
      description: '处理海量数据的大数据平台。基于Hadoop、Spark、Kafka等开源技术构建。提供数据湖、流式计算、批处理、数据挖掘、实时分析等能力。支持PB级数据处理。',
      category: '高级套餐',
      salesCount: 67,
      positiveReviews: 65,
      totalReviews: 67,
      tags: ['大数据', 'Hadoop', 'Spark', '数据挖掘'],
      imageUrl: '',
      status: 'active'
    },

    // 定制套餐
    {
      name: '金融科技解决方案',
      price: 12999,
      description: '为金融机构定制的科技解决方案。包含风控系统、支付清算、监管报送、量化交易、客户画像等专业模块。符合金融行业合规要求，提供7x24小时专属技术团队支持。',
      category: '定制套餐',
      salesCount: 23,
      positiveReviews: 23,
      totalReviews: 23,
      tags: ['金融科技', '风控系统', '合规', '量化交易'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '医疗信息化平台',
      price: 15999,
      description: '专为医疗机构设计的信息化平台。包含电子病历、医院管理、预约挂号、远程诊疗、药品管理等模块。符合医疗数据安全规范，支持HL7等医疗标准协议。',
      category: '定制套餐',
      salesCount: 18,
      positiveReviews: 18,
      totalReviews: 18,
      tags: ['医疗信息化', '电子病历', '远程诊疗', '数据安全'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '智慧城市解决方案',
      price: 25999,
      description: '面向政府和城市管理的智慧城市平台。集成交通管理、环境监测、公共安全、政务服务等系统。采用物联网、大数据、AI等技术，提升城市治理现代化水平。',
      category: '定制套餐',
      salesCount: 12,
      positiveReviews: 12,
      totalReviews: 12,
      tags: ['智慧城市', '物联网', '政务服务', '城市治理'],
      imageUrl: '',
      status: 'active'
    },
    {
      name: '工业4.0数字化',
      price: 35999,
      description: '为制造业企业提供的工业4.0数字化转型方案。包含生产管理、设备监控、质量控制、供应链管理、智能制造等模块。支持工业协议，实现产线数字化和智能化。',
      category: '定制套餐',
      salesCount: 8,
      positiveReviews: 8,
      totalReviews: 8,
      tags: ['工业4.0', '智能制造', '设备监控', '数字化转型'],
      imageUrl: '',
      status: 'active'
    },

    // 一些收藏的套餐
    {
      name: '创业加速器套餐',
      price: 599,
      description: '专为创业团队设计的全方位服务套餐。包含项目孵化、技术支持、市场推广、投资对接等服务。提供办公空间、导师指导、法务财务咨询，助力初创企业快速成长。',
      category: '进阶套餐',
      salesCount: 445,
      positiveReviews: 432,
      totalReviews: 445,
      tags: ['创业孵化', '导师指导', '投资对接', '市场推广'],
      imageUrl: '',
      status: 'active',
      isFavorite: true
    },
    {
      name: '游戏开发引擎',
      price: 2999,
      description: '专业的游戏开发和运营平台。提供游戏引擎、多人联机、实时对战、社交系统、支付系统、数据统计等功能。支持Unity、Unreal Engine等主流游戏引擎。',
      category: '高级套餐',
      salesCount: 234,
      positiveReviews: 227,
      totalReviews: 234,
      tags: ['游戏开发', '多人联机', '实时对战', '游戏引擎'],
      imageUrl: '',
      status: 'active',
      isFavorite: true
    },
    {
      name: '内容创作平台',
      price: 799,
      description: '为内容创作者打造的综合平台。包含视频处理、直播推流、内容分发、用户互动、变现工具等功能。支持多平台同步发布，提供创作者数据分析和粉丝管理工具。',
      category: '进阶套餐',
      salesCount: 567,
      positiveReviews: 548,
      totalReviews: 567,
      tags: ['内容创作', '视频处理', '直播推流', '粉丝管理'],
      imageUrl: '',
      status: 'active',
      isFavorite: true
    }
  ];

  return packages;
};
