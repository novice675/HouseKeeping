import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { tabBarConfig, getActiveTab } from '../utils/routes';
import styles from './TabBar.module.css';

const TabBar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    setActiveTab(getActiveTab(router.pathname));
  }, [router.pathname]);

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    router.push(path);
  };

  return (
    <div className={styles.tabBar}>
      {tabBarConfig.map((tab) => (
        <div
          key={tab.key}
          className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
          onClick={() => handleTabClick(tab.key, tab.path)}
          style={{
            color: activeTab === tab.key ? tab.activeColor : '#999'
          }}
        >
          <div className={styles.icon}>{tab.icon}</div>
          <span className={styles.label}>{tab.label}</span>
        </div>
      ))}
    </div>
  );
};

export default TabBar; 