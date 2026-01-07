import { observer } from 'mobx-react-lite';
import { useStores } from '@/stores';
import { IterationStatus } from '@/types/enum';
import styles from './index.module.css';

interface IterationsTabProps {
  appId: number;
}

const IterationsTab = observer(({ appId }: IterationsTabProps) => {
  const { appStore } = useStores();
  const iterations = appStore.getIterationsByAppId(appId);

  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>所有迭代历史</h3>
      {iterations.length === 0 ? (
        <div className={styles.emptyTable}>
          <div className={styles.emptyIcon}>📋</div>
          <p>暂无迭代记录</p>
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
            {iterations.map((iteration, index) => (
              <tr key={iteration.id} className={iteration.status === IterationStatus.FAILED ? styles.discardedRow : ''}>
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
                  ) : iteration.status === IterationStatus.PENDING ? (
                    <span 
                      className={styles.statusPending}
                      style={{
                        color: IterationStatus.getColor(IterationStatus.PENDING),
                        background: IterationStatus.getBgColor(IterationStatus.PENDING)
                      }}
                    >
                      {IterationStatus.getLabel(IterationStatus.PENDING)}
                    </span>
                  ) : iteration.status === IterationStatus.SUCCESS ? (
                    <span 
                      className={styles.statusSuccess}
                      style={{
                        color: IterationStatus.getColor(IterationStatus.SUCCESS),
                        background: IterationStatus.getBgColor(IterationStatus.SUCCESS)
                      }}
                    >
                      {IterationStatus.getLabel(IterationStatus.SUCCESS)}
                    </span>
                  ) : (
                    <span 
                      className={styles.statusDiscarded}
                      style={{
                        color: IterationStatus.getColor(IterationStatus.FAILED),
                        background: IterationStatus.getBgColor(IterationStatus.FAILED)
                      }}
                    >
                      {IterationStatus.getLabel(IterationStatus.FAILED)}
                    </span>
                  )}
                </td>
                <td className={styles.branchName}>{iteration.branchName}</td>
                <td>
                  {iteration.status === IterationStatus.FAILED ? (
                    <span className={styles.envBadgeDisabled}>-</span>
                  ) : (
                    <span className={styles.envBadge}>测试环境</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

export default IterationsTab;
