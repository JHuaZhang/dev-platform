import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStores } from '@/stores';
import { IterationStatus } from '@/types/enum';
import styles from './index.module.css';

interface OverviewTabProps {
  appId: number;
  app: any;
}

const OverviewTab = observer(({ appId, app }: OverviewTabProps) => {
  const { appStore } = useStores();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [description, setDescription] = useState('');

  const iterations = appStore.getIterationsByAppId(appId);
  const ongoingIterations = iterations.filter(
    i => i.status === IterationStatus.BUILDING || i.status === IterationStatus.PENDING
  );

  const handleCreateIteration = () => {
    if (!branchName.trim()) {
      alert('请输入分支名称');
      return;
    }
    appStore.addIteration(appId, {
      branchName,
      description
    });
    setShowCreateModal(false);
    setBranchName('');
    setDescription('');
  };

  const handleBatchDiscard = () => {
    if (window.confirm('确定要废弃所有进行中的迭代吗？')) {
      console.log('批量废弃迭代');
    }
  };

  return (
    <>
      <div className={styles.appInfoSection}>
        <h3 className={styles.sectionTitle}>应用详情</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>GitLab 地址</span>
            <a href={app.gitlabUrl} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
              {app.gitlabUrl}
            </a>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>创建时间</span>
            <span className={styles.infoValue}>2024-01-01 10:00:00</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>创建者</span>
            <span className={styles.infoValue}>张三</span>
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.sectionTitle}>进行中的迭代</h3>
          <div className={styles.tableActions}>
            <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
              <span className={styles.createIcon}>+</span>
              创建迭代
            </button>
            <button className={styles.discardBtn} onClick={handleBatchDiscard}>
              快速废弃迭代
            </button>
          </div>
        </div>
        {ongoingIterations.length === 0 ? (
          <div className={styles.emptyTable}>
            <div className={styles.emptyIcon}>📋</div>
            <p>暂无进行中的迭代</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>序号</th>
                <th>迭代名称</th>
                <th>创建时间</th>
                <th>版本号</th>
                <th>创建人</th>
                <th>状态</th>
                <th>迭代分支</th>
                <th>发布环境</th>
              </tr>
            </thead>
            <tbody>
              {ongoingIterations.map((iteration, index) => (
                <tr key={iteration.id}>
                  <td>{index + 1}</td>
                  <td className={styles.iterationName}>{iteration.description || '未命名迭代'}</td>
                  <td>{iteration.createTime}</td>
                  <td>v1.0.{iteration.id}</td>
                  <td>张三</td>
                  <td>
                  {iteration.status === IterationStatus.BUILDING ? (
                    <span 
                      className={styles.statusRunning}
                      style={{
                        color: IterationStatus.getColor(IterationStatus.BUILDING),
                        background: IterationStatus.getBgColor(IterationStatus.BUILDING)
                      }}
                    >
                      <span className={styles.loadingDot}></span>
                      {IterationStatus.getLabel(IterationStatus.BUILDING)}
                    </span>
                  ) : (
                    <span 
                      className={styles.statusPending}
                      style={{
                        color: IterationStatus.getColor(IterationStatus.PENDING),
                        background: IterationStatus.getBgColor(IterationStatus.PENDING)
                      }}
                    >
                      {IterationStatus.getLabel(IterationStatus.PENDING)}
                    </span>
                  )}
                  </td>
                  <td className={styles.branchName}>{iteration.branchName}</td>
                  <td>
                    <span className={styles.envBadge}>测试环境</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </>
  );
});

export default OverviewTab;
