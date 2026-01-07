import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStores } from '@/stores';
import styles from './index.module.css';

const AppList = observer(() => {
  const { appStore } = useStores();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');

  const handleCreateApp = () => {
    if (!newAppName.trim()) {
      alert('请输入应用名称');
      return;
    }
    appStore.addApp({
      name: newAppName,
      description: newAppDesc,
      gitlabUrl: '',
      jenkinsUrl: ''
    });
    setShowCreateModal(false);
    setNewAppName('');
    setNewAppDesc('');
  };

  return (
    <div className={styles.appList}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>应用管理</h1>
          <p className={styles.subtitle}>管理你的所有应用和代码迭代</p>
        </div>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          <span className={styles.createIcon}>+</span>
          新建应用
        </button>
      </div>

      {appStore.appList.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h3 className={styles.emptyTitle}>暂无应用</h3>
          <p className={styles.emptyDesc}>创建你的第一个应用，开始管理代码迭代</p>
          <button 
            className={styles.emptyBtn}
            onClick={() => setShowCreateModal(true)}
          >
            立即创建
          </button>
        </div>
      ) : (
        <div className={styles.appGrid}>
          {appStore.appList.map(app => (
            <div 
              key={app.id} 
              className={styles.appCard}
              onClick={() => navigate(`/apps/${app.id}`)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.appIcon}>
                  {app.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.appInfo}>
                  <h3 className={styles.appName}>{app.name}</h3>
                  <p className={styles.appDesc}>{app.description || '暂无描述'}</p>
                </div>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>迭代次数</span>
                  <span className={styles.statValue}>{app.iterationCount}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>最后更新</span>
                  <span className={styles.statValue}>{app.lastUpdate}</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.statusBadge}>运行中</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>新建应用</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>应用名称</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="请输入应用名称"
                  value={newAppName}
                  onChange={e => setNewAppName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>应用描述</label>
                <textarea
                  className={styles.textarea}
                  placeholder="请输入应用描述（可选）"
                  rows={3}
                  value={newAppDesc}
                  onChange={e => setNewAppDesc(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowCreateModal(false)}
              >
                取消
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleCreateApp}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AppList;
