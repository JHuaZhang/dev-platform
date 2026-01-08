import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { message } from 'antd';
import { CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState, useCallback } from 'react';
import { routeConfig } from '@/router/config';
import { useStores } from '@/stores';
import styles from './index.module.css';

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  targetKey: string;
}

interface Tab {
  key: string;
  label: string;
  path: string;
  closable: boolean;
  params?: Record<string, string>;
  state?: unknown;
}

interface RouteConfigItem {
  path: string;
  title?: string;
  closable?: boolean;
  children?: RouteConfigItem[];
  redirect?: string;
}

const GlobalHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appStore } = useStores();
  const username = localStorage.getItem('username') || '用户';
  const [tabs, setTabs] = useState<Tab[]>(() => {
    // 从 localStorage 恢复标签页
    const savedTabs = localStorage.getItem('app-tabs');
    return savedTabs ? JSON.parse(savedTabs) : [];
  });
  const [activeKey, setActiveKey] = useState(() => {
    // 从 localStorage 恢复激活的标签
    return localStorage.getItem('app-active-tab') || '';
  });
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    visible: false,
    x: 0,
    y: 0,
    targetKey: '',
  });
  const tabsRef = useRef<HTMLDivElement>(null);

  // 保存标签页到 localStorage
  useEffect(() => {
    localStorage.setItem('app-tabs', JSON.stringify(tabs));
  }, [tabs]);

  // 保存激活的标签到 localStorage
  useEffect(() => {
    if (activeKey) {
      localStorage.setItem('app-active-tab', activeKey);
    } else {
      localStorage.removeItem('app-active-tab');
    }
  }, [activeKey]);

  const findRouteConfig = (
    path: string
  ): { config: RouteConfigItem | null; params: Record<string, string> } => {
    const routes = routeConfig.find((r) => r.children && r.path === '/')?.children || [];

    for (const route of routes) {
      if (route.redirect) continue;

      const match = matchPath(route.path, path);
      if (match) {
        return { config: route, params: match.params as Record<string, string> };
      }
    }

    return { config: null, params: {} };
  };

  const generateTabLabel = useCallback(
    (config: RouteConfigItem, params: Record<string, string>, path: string): string => {
      if (!config.title) return '未命名页面';

      if (path.match(/^\/apps\/[^/]+$/)) {
        const appId = params.appIdentifier;
        const app = appStore.getAppByAppId(appId);
        return app ? app.name : '应用详情';
      }

      if (path.match(/^\/apps\/[^/]+\/history$/)) {
        const appId = params.appIdentifier;
        const app = appStore.getAppByAppId(appId);
        return app ? `${app.name} - 迭代历史` : '迭代历史';
      }

      return config.title;
    },
    [appStore]
  );

  useEffect(() => {
    if (!location.pathname) return;
    const path = location.pathname;

    // 应用管理页面不显示标签，但保留现有标签
    if (path === '/apps') {
      setActiveKey('');
      return;
    }

    // 用户编辑页面显示标签
    if (path === '/users') {
      const tabKey = path;
      const existingTab = tabs.find((t) => t.key === tabKey);

      if (!existingTab) {
        const newTab: Tab = {
          key: tabKey,
          label: '用户编辑',
          path: path,
          closable: true,
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
      }

      setActiveKey(tabKey);
      return;
    }

    // 权限管理页面显示标签
    if (path === '/permissions') {
      const tabKey = path;
      const existingTab = tabs.find((t) => t.key === tabKey);

      if (!existingTab) {
        const newTab: Tab = {
          key: tabKey,
          label: '权限管理',
          path: path,
          closable: true,
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
      }

      setActiveKey(tabKey);
      return;
    }

    // 新建应用页面显示标签
    if (path === '/apps/create') {
      const tabKey = path;
      const existingTab = tabs.find((t) => t.key === tabKey);

      if (!existingTab) {
        const newTab: Tab = {
          key: tabKey,
          label: '新建应用',
          path: path,
          closable: true,
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
      }

      setActiveKey(tabKey);
      return;
    }

    const { config, params } = findRouteConfig(path);

    if (!config) return;

    const tabKey = path;
    const tabLabel = generateTabLabel(config, params, path);
    const tabClosable = config.closable !== false;

    const existingTab = tabs.find((t) => t.key === tabKey);

    if (!existingTab) {
      const newTab: Tab = {
        key: tabKey,
        label: tabLabel,
        path: path,
        closable: tabClosable,
        params,
      };

      setTabs((prevTabs) => [...prevTabs, newTab]);
    } else {
      setTabs((prevTabs) =>
        prevTabs.map((t) => (t.key === tabKey ? { ...t, label: tabLabel, params } : t))
      );
    }

    setActiveKey(tabKey);
  }, [location.pathname, tabs, generateTabLabel]);

  const removeTab = (targetKey: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // 如果关闭的是新建应用标签页，清除表单缓存
    if (targetKey === '/apps/create') {
      sessionStorage.removeItem('createAppFormData');
      sessionStorage.removeItem('createAppStep');
      sessionStorage.removeItem('createAppTemplate');
    }

    // 清除该标签页的状态缓存
    sessionStorage.removeItem(`tab-state-${targetKey}`);

    const targetIndex = tabs.findIndex((tab) => tab.key === targetKey);
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);

    if (newTabs.length && targetKey === activeKey) {
      const nextTab = newTabs[targetIndex] || newTabs[targetIndex - 1];
      setActiveKey(nextTab.key);
      navigate(nextTab.path, { state: nextTab.state });
    } else if (newTabs.length === 0) {
      setActiveKey('');
      navigate('/apps');
    }

    setTabs(newTabs);
  };

  const closeOtherTabs = () => {
    const currentTab = tabs.find((t) => t.key === activeKey);

    if (currentTab) {
      setTabs([currentTab]);
    }
    message.success('已关闭其他标签页');
  };

  const closeAllTabs = () => {
    // 清除新建应用的表单缓存
    sessionStorage.removeItem('createAppFormData');
    sessionStorage.removeItem('createAppStep');
    sessionStorage.removeItem('createAppTemplate');

    // 清除所有标签页的状态缓存
    tabs.forEach((tab) => {
      sessionStorage.removeItem(`tab-state-${tab.key}`);
    });

    setTabs([]);
    setActiveKey('');
    navigate('/apps');
    message.success('已关闭所有标签页');
    setContextMenu({ visible: false, x: 0, y: 0, targetKey: '' });
  };

  const handleTabClick = (tab: Tab) => {
    setActiveKey(tab.key);
    navigate(tab.path, { state: tab.state });
  };

  const handleContextMenu = (e: React.MouseEvent, tabKey: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetKey: tabKey,
    });
  };

  const handleCloseOthersFromMenu = () => {
    const currentTab = tabs.find((t) => t.key === contextMenu.targetKey);
    if (currentTab) {
      // 如果关闭的标签中包含新建应用页面，清除表单缓存
      const hasCreateTab = tabs.some((t) => t.key === '/apps/create' && t.key !== currentTab.key);
      if (hasCreateTab) {
        sessionStorage.removeItem('createAppFormData');
        sessionStorage.removeItem('createAppStep');
        sessionStorage.removeItem('createAppTemplate');
      }

      // 清除其他标签页的状态缓存
      tabs.forEach((tab) => {
        if (tab.key !== currentTab.key) {
          sessionStorage.removeItem(`tab-state-${tab.key}`);
        }
      });

      setTabs([currentTab]);
      setActiveKey(currentTab.key);
      navigate(currentTab.path, { state: currentTab.state });
    }
    message.success('已关闭其他标签页');
    setContextMenu({ visible: false, x: 0, y: 0, targetKey: '' });
  };

  const handleCloseAllFromMenu = () => {
    closeAllTabs();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, targetKey: '' });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('app-tabs');
    localStorage.removeItem('app-active-tab');
    sessionStorage.removeItem('createAppFormData');
    sessionStorage.removeItem('createAppStep');
    sessionStorage.removeItem('createAppTemplate');
    message.success('退出登录成功');
    navigate('/login');
  };

  return (
    <div className={styles.globalHeader}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🚀</span>
        <span className={styles.logoText}>发布平台</span>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper} ref={tabsRef}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`${styles.tab} ${activeKey === tab.key ? styles.tabActive : ''}`}
                onClick={() => handleTabClick(tab)}
                onContextMenu={(e) => handleContextMenu(e, tab.key)}
              >
                <span className={styles.tabLabel}>{tab.label}</span>
                {tab.closable && (
                  <CloseOutlined
                    className={styles.tabClose}
                    onClick={(e) => removeTab(tab.key, e)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {tabs.length > 1 && (
          <div className={styles.tabActions}>
            <button className={styles.actionBtn} onClick={closeOtherTabs} title="关闭其他">
              <CloseCircleOutlined />
            </button>
            <button className={styles.actionBtn} onClick={closeAllTabs} title="关闭全部">
              <CloseOutlined />
            </button>
          </div>
        )}
      </div>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{username.charAt(0).toUpperCase()}</div>
          <span className={styles.userName}>{username}</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </button>
      </div>

      {contextMenu.visible && (
        <div
          className={styles.contextMenu}
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <div className={styles.contextMenuItem} onClick={handleCloseOthersFromMenu}>
            <CloseCircleOutlined className={styles.contextMenuIcon} />
            关闭其他标签页
          </div>
          <div className={styles.contextMenuItem} onClick={handleCloseAllFromMenu}>
            <CloseOutlined className={styles.contextMenuIcon} />
            关闭全部标签页
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalHeader;
