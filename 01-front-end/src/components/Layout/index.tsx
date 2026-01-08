import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import styles from './index.module.css';

const Layout = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['apps']);

  const menuItems = [
    {
      key: 'apps',
      label: '应用管理',
      icon: '📦',
      path: '/apps',
      children: [],
    },
    {
      key: 'system',
      label: '系统管理',
      icon: '⚙️',
      children: [
        { key: 'users', label: '用户编辑', path: '/users' },
        { key: 'permissions', label: '权限管理', path: '/permissions' },
      ],
    },
  ];

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isMenuActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (children: { path: string }[]) => {
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <div className={styles.layout}>
      <GlobalHeader />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <div key={item.key}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <div
                      className={`${styles.navItem} ${
                        isParentActive(item.children) ? styles.navItemActive : ''
                      }`}
                      onClick={() => toggleMenu(item.key)}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                      <span
                        className={styles.navArrow}
                        style={{
                          transform: expandedMenus.includes(item.key)
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)',
                        }}
                      >
                        ▶
                      </span>
                    </div>
                    {expandedMenus.includes(item.key) && (
                      <div className={styles.subMenu}>
                        {item.children.map((child) => (
                          <div
                            key={child.key}
                            className={`${styles.subMenuItem} ${
                              isMenuActive(child.path) ? styles.subMenuItemActive : ''
                            }`}
                            onClick={() => navigate(child.path)}
                          >
                            <span className={styles.subMenuLabel}>{child.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`${styles.navItem} ${
                      isMenuActive(item.path || '') ? styles.navItemActive : ''
                    }`}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <main className={styles.main}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
});

export default Layout;
