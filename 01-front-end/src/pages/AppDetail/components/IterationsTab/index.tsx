import { observer } from 'mobx-react-lite';
import { useStores } from '@/stores';
import { IterationStatus } from '@/types/enum';
import type { Iteration } from '@/stores/AppStore';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.css';

interface IterationsTabProps {
  appId: number;
}

const IterationsTab = observer(({ appId }: IterationsTabProps) => {
  const { appStore } = useStores();
  const iterations = appStore.getIterationsByAppId(appId);

  const columns: ColumnsType<Iteration> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_: unknown, __: unknown, index: number) => index + 1
    },
    {
      title: '迭代名称',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '未命名迭代'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '版本号',
      key: 'version',
      width: 120,
      render: (_: unknown, record: Iteration) => `v1.0.${record.id}`
    },
    {
      title: '创建人',
      key: 'creator',
      width: 100,
      render: () => '张三'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: IterationStatus) => {
        const statusMap = {
          [IterationStatus.BUILDING]: (
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
          ),
          [IterationStatus.PENDING]: (
            <span 
              className={styles.statusPending}
              style={{
                color: IterationStatus.getColor(IterationStatus.PENDING),
                background: IterationStatus.getBgColor(IterationStatus.PENDING)
              }}
            >
              {IterationStatus.getLabel(IterationStatus.PENDING)}
            </span>
          ),
          [IterationStatus.SUCCESS]: (
            <span 
              className={styles.statusSuccess}
              style={{
                color: IterationStatus.getColor(IterationStatus.SUCCESS),
                background: IterationStatus.getBgColor(IterationStatus.SUCCESS)
              }}
            >
              {IterationStatus.getLabel(IterationStatus.SUCCESS)}
            </span>
          ),
          [IterationStatus.FAILED]: (
            <span 
              className={styles.statusDiscarded}
              style={{
                color: IterationStatus.getColor(IterationStatus.FAILED),
                background: IterationStatus.getBgColor(IterationStatus.FAILED)
              }}
            >
              {IterationStatus.getLabel(IterationStatus.FAILED)}
            </span>
          )
        };
        return statusMap[status];
      }
    },
    {
      title: '迭代分支',
      dataIndex: 'branchName',
      key: 'branchName',
      render: (text: string) => <span className={styles.branchName}>{text}</span>
    },
    {
      title: '发布环境',
      key: 'env',
      width: 120,
      render: (_: unknown, record: Iteration) => {
        if (record.status === IterationStatus.FAILED) {
          return <span className={styles.envBadgeDisabled}>-</span>;
        }
        return <span className={styles.envBadge}>测试环境</span>;
      }
    }
  ];

  return (
    <div className={styles.tableSection}>
      <h3 className={styles.sectionTitle}>所有迭代历史</h3>
      <Table
        columns={columns}
        dataSource={iterations}
        rowKey="id"
        pagination={false}
        rowClassName={(record) => 
          record.status === IterationStatus.FAILED ? styles.discardedRow : ''
        }
        locale={{
          emptyText: (
            <div className={styles.emptyTable}>
              <div className={styles.emptyIcon}>📋</div>
              <p>暂无迭代记录</p>
            </div>
          )
        }}
      />
    </div>
  );
});

export default IterationsTab;
