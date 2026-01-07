import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStores } from '@/stores';
import styles from './index.module.css';

const AppDetail = observer(() => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { appStore } = useStores();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [description, setDescription] = useState('');

  const app = appStore.appList.find(a => a.id === Number(appId));
  const iterations = appStore.getIterationsByAppId(Number(appId));

  if (!app) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h2>应用不存在</h2>
        <button onClick={() => navigate('/apps')}>返回应用列表</button>
      </div>
    );
  }

  const handleCreateIteration = () => {
    if (!branchName.trim()) {
      alert('请输入分支名称');
      return;
    }
    appStore.addIteration(Number(appId), {
      branchName,
      description
    });
    setShowCreateModal(false);
    setBranchName('');
    setDescription('');
  };

  const statusConfig = {
    pending: { label: '待构建', color: '#faad14', bg: '#2d2d2d' },
    building: { label: '构建中', color: '#1890ff', bg: '#2d2d2d' },
    success: { label: '构建成功', color: '#52c41a', bg: '#2d2d2d' },
    failed: { label: '构建失败', color: '#f5222d', bg: '#2d2d2d' }
  };

  const getPipelineStages = (status: string) => {
    const stages = [
      { name: 'Clone', icon: '📥', status: 'success' },
      { name: 'Build', icon: '🔨', status: status === 'pending' ? 'pending' : 'success' },
      { name: 'Test', icon: '🧪', status: status === 'building' ? 'running' : status === 'pending' ? 'pending' : status },
      { name: 'Deploy', icon: '🚀', status: status === 'success' ? 'success' : status === 'failed' ? 'failed' : 'pending' }
    ];
    return stages;
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'success': return '#52c41a';
      case 'running': return '#1890ff';
      case 'failed': return '#f5222d';
      default: return '#8c8c8c';
    }
  };

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
        <div className={styles.headerActions}>
          <button 
            className={styles.historyBtn}
            onClick={() => navigate(`/apps/${appId}/history`)}
          >
            📋 迭代历史
          </button>
          <button 
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            <span className={styles.createIcon}>+</span>
            新建迭代
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>应用概览</h2>
        <div className={styles.overview}>
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>📊</div>
            <div className={styles.overviewInfo}>
              <div className={styles.overviewLabel}>总迭代次数</div>
              <div className={styles.overviewValue}>{app.iterationCount}</div>
            </div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>✅</div>
            <div className={styles.overviewInfo}>
              <div className={styles.overviewLabel}>成功构建</div>
              <div className={styles.overviewValue}>
                {iterations.filter(i => i.status === 'success').length}
              </div>
            </div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>🔄</div>
            <div className={styles.overviewInfo}>
              <div className={styles.overviewLabel}>构建中</div>
              <div className={styles.overviewValue}>
                {iterations.filter(i => i.status === 'building').length}
              </div>
            </div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>📅</div>
            <div className={styles.overviewInfo}>
              <div className={styles.overviewLabel}>最后更新</div>
              <div className={styles.overviewValue}>{app.lastUpdate}</div>
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>最近迭代</h2>
        {iterations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>暂无迭代记录</h3>
            <p>创建第一个代码迭代，开始你的开发之旅</p>
          </div>
        ) : (
          <div className={styles.recentList}>
            {iterations.slice(0, 3).map((iteration) => (
              <div key={iteration.id} className={styles.recentItem}>
                <div className={styles.recentLeft}>
                  <h4 className={styles.recentBranch}>{iteration.branchName}</h4>
                  <p className={styles.recentDesc}>{iteration.description || '暂无描述'}</p>
                  <span className={styles.recentTime}>{iteration.createTime}</span>
                </div>
                <span 
                  className={styles.recentStatus}
                  style={{
                    color: statusConfig[iteration.status].color,
                    background: statusConfig[iteration.status].bg,
                    border: `1px solid ${statusConfig[iteration.status].color}`
                  }}
                >
                  {statusConfig[iteration.status].label}
                </span>
              </div>
            ))}
            {iterations.length > 3 && (
              <button 
                className={styles.viewAllBtn}
                onClick={() => navigate(`/apps/${appId}/history`)}
              >
                查看全部迭代 →
              </button>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>新建代码迭代</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>分支名称</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="例如: feature/new-function"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>迭代描述</label>
                <textarea
                  className={styles.textarea}
                  placeholder="请描述本次迭代的主要内容（可选）"
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className={styles.tips}>
                <div className={styles.tipsIcon}>💡</div>
                <div className={styles.tipsContent}>
                  <p>创建迭代后将自动执行以下操作：</p>
                  <ul>
                    <li>在 GitLab 中创建新分支</li>
                    <li>触发 Jenkins 构建流水线</li>
                    <li>生成独立的预览页面</li>
                  </ul>
                </div>
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
                onClick={handleCreateIteration}
              >
                创建并构建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AppDetail;
