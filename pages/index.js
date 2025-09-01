import { useState, useEffect } from 'react';
import Link from 'next/link';
import TabBar from '../components/TabBar';
import PackageCard from '../components/PackageCard';
import { usePackages } from '../hooks/usePackages';
import styles from '../components/TabBar.module.css';
import SimpleLocation from '../components/SimpleLocation';


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { packages, loading, error, refetch } = usePackages();

  // 获取热门套餐（按销量排序，取前6个）
  const popularPackages = packages
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 6);

  const [currentSlide, setCurrentSlide] = useState(0);

  // 轮播图数据
  const carouselImages = [
    { id: 1, title: '专业保洁服务', subtitle: '让您的家焕然一新', bgColor: '#ff6b6b' },
    { id: 2, title: '空调清洗保养', subtitle: '健康呼吸每一天', bgColor: '#4ecdc4' },
    { id: 3, title: '专业育婴师', subtitle: '宝宝成长好帮手', bgColor: '#45b7d1' },
    { id: 4, title: '家电维修专家', subtitle: '快速解决您的问题', bgColor: '#f39c12' },
    { id: 5, title: '阿姨招募平台', subtitle: '找到合适的家政帮手', bgColor: '#9b59b6' }
  ];

  // 服务类型数据
  const serviceTypes = [
    { icon: '🧽', title: '擦玻璃', color: '#3498db' },
    { icon: '❄️', title: '空调清洗', color: '#2ecc71' },
    { icon: '👨‍🍳', title: '做饭小时工', color: '#e74c3c' },
    { icon: '👶', title: '育婴师', color: '#f39c12' },
    { icon: '🪑', title: '家具清洁', color: '#9b59b6' },
    { icon: '🔧', title: '空调维修', color: '#1abc9c' },
    { icon: '⚡', title: '家电维修', color: '#e67e22' },
    { icon: '👩‍💼', title: '阿姨招募', color: '#34495e' }
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 手动切换轮播图
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className={styles.pageContent}>
      {/* 轮播图 */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: image.bgColor,
              display: index === currentSlide ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <h2 style={{ margin: '0 0 10px', fontSize: '24px', fontWeight: 'bold' }}>
              {image.title}
            </h2>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              {image.subtitle}
            </p>
          </div>
        ))}
        
        {/* 轮播图指示器 */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      {/* 使用简化的定位组件，启用自动定位 */}
      <SimpleLocation autoLocate={true} />

      {/* 服务类型 */}
      <div style={{ padding: '20px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          服务类型
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '15px' 
        }}>
          {serviceTypes.map((service, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '15px 10px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: service.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '8px'
              }}>
                {service.icon}
              </div>
              <span style={{
                fontSize: '12px',
                textAlign: 'center',
                color: '#333',
                fontWeight: '500'
              }}>
                {service.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ margin: '0 0 15px', fontSize: '20px', fontWeight: 'bold' }}>快速链接</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/database-admin" style={{
            background: '#8b5cf6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            数据库管理
          </Link>
          <Link href="/service" style={{
            background: '#10b981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            全部服务
          </Link>
          <Link href="/favorites" style={{
            background: '#f59e0b',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            我的收藏
          </Link>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
