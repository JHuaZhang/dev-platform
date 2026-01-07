import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStores } from '@/stores';
import OverviewTab from './components/OverviewTab/index';
import IterationsTab from './components/IterationsTab/index';
import PagesTab from './components/PagesTab/index';
import MembersTab from './components/MembersTab/index';
import styles from './index.module.css';

const AppDetail = observer(() => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { appStore } = useStores();
  const [activeTab, setActiveTab] = useState('overview');

  const app = appStore.appList.find(a => a.id === Number(appId));

  if (!app) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h2>应用不存在</h2>
        <button onClick={() => navigate('/apps')}>返回应用列表</button>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: '综合', icon: '📊' },
    { key: 'iterations', label: '迭代', icon: '🔄' },
    { key: 'pages', label: '页面列表', icon: '📄' },
    { key: 'members', label: '成员配置', icon: '👥' }
  ];

  return (
    <div className={styles.appDetail}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/apps')}>
          ← 返回
        </button>
        <div className={styles.appInfo}>
          <div className={styles.appIcon}>
            {app.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.appName}>{app.name}</h1>
            <p className={styles.appDesc}>{app.description || '暂无描述'}</p>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && <OverviewTab appId={Number(appId)} app={app} />}
        {activeTab === 'iterations' && <IterationsTab appId={Number(appId)} />}
        {activeTab === 'pages' && <PagesTab />}
        {activeTab === 'members' && <MembersTab />}
      </div>
    </div>
  );
});

export default AppDetail;
