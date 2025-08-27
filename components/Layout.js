import TabBar from './TabBar';
import styles from './TabBar.module.css';

const Layout = ({ children }) => {
  return (
    <div>
      <main className={styles.pageContent}>
        {children}
      </main>
      <TabBar />
    </div>
  );
};

export default Layout; 