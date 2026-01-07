import { Outlet, NavLink } from 'react-router-dom';
import styles from './index.module.css';

const Layout = () => {
  const menuItems = [
    { path: '/apps', label: '应用管理', icon: '📦' }
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🚀</span>
          <span className={styles.logoText}>发布平台</span>
        </div>
        <nav className={styles.menu}>
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`
              }
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
