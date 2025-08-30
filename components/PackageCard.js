import { useState } from 'react';
import { useFavorite } from '../hooks/usePackages';
import { utils } from '../utils/api';
import styles from './PackageCard.module.css';

const PackageCard = ({ package: pkg, onUpdate }) => {
  const [isFavorite, setIsFavorite] = useState(pkg.isFavorite);
  const { toggleFavorite, loading: favoriteLoading } = useFavorite();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    try {
      const newFavoriteStatus = !isFavorite;
      await toggleFavorite(pkg._id, newFavoriteStatus);
      setIsFavorite(newFavoriteStatus);
      
      // 通知父组件更新
      if (onUpdate) {
        onUpdate(pkg._id, { isFavorite: newFavoriteStatus });
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      // 可以添加错误提示
    }
  };

  const handleCardClick = () => {
    // 这里可以添加跳转到详情页的逻辑
    console.log('点击套餐卡片:', pkg._id);
  };

  return (
    <div className={styles.packageCard} onClick={handleCardClick}>
      {/* 套餐图片 */}
      <div className={styles.imageContainer}>
        {pkg.imageUrl ? (
          <img 
            src={pkg.imageUrl} 
            alt={pkg.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>📦</span>
          </div>
        )}
        
        {/* 收藏按钮 */}
        <button 
          className={`${styles.favoriteBtn} ${isFavorite ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        
        {/* 分类标签 */}
        <div className={styles.categoryTag}>
          {pkg.category}
        </div>
      </div>

      {/* 套餐信息 */}
      <div className={styles.content}>
        <h3 className={styles.name}>{pkg.name}</h3>
        
        <p className={styles.description}>
          {utils.truncateText(pkg.description, 80)}
        </p>
        
        {/* 价格和销量 */}
        <div className={styles.priceSection}>
          <span className={styles.price}>
            {utils.formatPrice(pkg.price)}
          </span>
          <span className={styles.sales}>
            已售 {utils.formatNumber(pkg.salesCount)}
          </span>
        </div>
        
        {/* 评价信息 */}
        {pkg.totalReviews > 0 && (
          <div className={styles.ratingSection}>
            <span 
              className={styles.rating}
              style={{ color: utils.getRatingColor(pkg.positiveRate) }}
            >
              {utils.getRatingText(pkg.positiveRate)} {pkg.positiveRate}%
            </span>
            <span className={styles.reviewCount}>
              ({pkg.totalReviews}条评价)
            </span>
          </div>
        )}
        
        {/* 标签 */}
        {pkg.tags && pkg.tags.length > 0 && (
          <div className={styles.tags}>
            {pkg.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCard; 