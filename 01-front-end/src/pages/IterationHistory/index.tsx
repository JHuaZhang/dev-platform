import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useStores } from '@/stores';
import { IterationStatus, PipelineStageStatus } from '@/types/enum';
import styles from './index.module.css';

const IterationHistory = observer(() => {
  const { appIdentifier } = useParams();
  const navigate = useNavigate();
  const { appStore } = useStores();

  const app = appStore.getAppByAppId(appIdentifier || '');
  const iterations = app ? appStore.getIterationsByAppId(app.id) : [];

  if (!app) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h2>应用不存在</h2>
        <button onClick={() => navigate('/apps')}>返回应用列表</button>
      </div>
    );
  }

  const getPipelineStages = (status: IterationStatus) => {
    const stages = [
      { name: 'Clone', icon: '📥', status: PipelineStageStatus.SUCCESS },
      { 
        name: 'Build', 
        icon: '🔨', 
        status: status === IterationStatus.PENDING ? PipelineStageStatus.PENDING : PipelineStageStatus.SUCCESS 
      },
      { 
        name: 'Test', 
        icon: '🧪', 
        status: status === IterationStatus.BUILDING 
          ? PipelineStageStatus.RUNNING 
          : status === IterationStatus.PENDING 
            ? PipelineStageStatus.PENDING 
            : status === IterationStatus.SUCCESS 
              ? PipelineStageStatus.SUCCESS 
              : PipelineStageStatus.FAILED
      },
      { 
        name: 'Deploy', 
        icon: '🚀', 
        status: status === IterationStatus.SUCCESS 
          ? PipelineStageStatus.SUCCESS 
          : status === IterationStatus.FAILED 
            ? PipelineStageStatus.FAILED 
            : PipelineStageStatus.PENDING
      }
    ];
    return stages;
  };

  return (
    <div className={styles.iterationHistory}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(`/apps/${appIdentifier}`)}>
          ← 返回
        </button>
        <div className={styles.appInfo}>
          <div className={styles.appIcon}>
            {app.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.appName}>{app.name}</h1>
            <p className={styles.appDesc}>迭代历史记录</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>代码迭代历史</h2>
        {iterations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>暂无迭代记录</h3>
            <p>该应用还没有创建任何代码迭代</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {iterations.map((iteration) => (
              <div key={iteration.id} className={styles.timelineItem}>
                <div className={styles.iterationCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLeft}>
                      <h3 className={styles.branchName}>{iteration.branchName}</h3>
                      <p className={styles.iterationDesc}>{iteration.description || '暂无描述'}</p>
                    </div>
                    <span 
                      className={styles.statusBadge}
                      style={{
                        color: IterationStatus.getColor(iteration.status),
                        background: '#2d2d2d',
                        border: `1px solid ${IterationStatus.getColor(iteration.status)}`
                      }}
                    >
                      {IterationStatus.getLabel(iteration.status)}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>创建时间:</span>
                        <span className={styles.infoValue}>{iteration.createTime}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>构建时长:</span>
                        <span className={styles.infoValue}>{iteration.buildDuration || '-'}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>任务ID:</span>
                        <span className={styles.infoValue}>#{iteration.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.pipelineStages}>
                      {getPipelineStages(iteration.status).map((stage, idx) => (
                        <div key={idx} className={styles.stage}>
                          <span className={styles.stageIcon}>{stage.icon}</span>
                          <span 
                            className={styles.stageName}
                            style={{ color: PipelineStageStatus.getColor(stage.status) }}
                          >
                            {stage.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default IterationHistory;
