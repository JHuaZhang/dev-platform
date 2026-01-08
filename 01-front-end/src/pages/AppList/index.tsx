import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@/stores';
import styles from './index.module.css';

const AppList = observer(() => {
  const { appStore } = useStores();
  const navigate = useNavigate();

  const getOngoingIterationsCount = (appId: number) => {
    return appStore
      .getIterationsByAppId(appId)
      .filter((i) => i.status === 'building' || i.status === 'pending').length;
  };

  return (
    <div className={styles.appList}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>应用管理</h1>
          <p className={styles.subtitle}>管理你的所有应用和代码迭代</p>
        </div>
        <button className={styles.createBtn} onClick={() => navigate('/apps/create')}>
          <span className={styles.createIcon}>+</span>
          新建应用
        </button>
      </div>

      <div className={styles.content}>
        {appStore.appList.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3 className={styles.emptyTitle}>暂无应用</h3>
            <p className={styles.emptyDesc}>创建你的第一个应用，开始管理代码迭代</p>
            <button className={styles.emptyBtn} onClick={() => navigate('/apps/create')}>
              立即创建
            </button>
          </div>
        ) : (
          <div className={styles.appGrid}>
            {appStore.appList.map((app) => {
              const ongoingIterations = getOngoingIterationsCount(app.id);

              return (
                <div
                  key={app.id}
                  className={`${styles.appCard} ${
                    !app.hasPermission ? styles.appCardDisabled : ''
                  }`}
                  onClick={() => app.hasPermission && navigate(`/apps/${app.appId}`)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.appIcon}>{app.name.charAt(0).toUpperCase()}</div>
                    <div className={styles.appInfo}>
                      <h3 className={styles.appName}>{app.name}</h3>
                      <p className={styles.appDesc}>{app.description || '暂无描述'}</p>
                    </div>
                  </div>
                  <div className={styles.cardStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>总迭代</span>
                      <span className={styles.statValue}>{app.iterationCount}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>进行中</span>
                      <span className={styles.statValue}>{ongoingIterations}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>最后更新</span>
                      <span className={styles.statValue}>{app.lastUpdate.slice(5)}</span>
                    </div>
                  </div>
                  <div className={styles.cardFooter}>
                    {app.hasPermission ? (
                      <span className={styles.statusBadge}>运行中</span>
                    ) : (
                      <span className={styles.statusBadgeDisabled}>无权限</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default AppList;
