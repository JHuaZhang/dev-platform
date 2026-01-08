import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStores } from '@/stores';
import { IterationStatus } from '@/types/enum';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Iteration } from '@/stores/AppStore';
import styles from './index.module.css';

const { TextArea } = Input;

interface App {
  id: number;
  appId: string;
  name: string;
  description: string;
  gitlabUrl: string;
  jenkinsUrl: string;
  iterationCount: number;
  lastUpdate: string;
  hasPermission: boolean;
}

interface OverviewTabProps {
  appId: number;
  app: App;
}

const OverviewTab = observer(({ appId, app }: OverviewTabProps) => {
  const { appStore } = useStores();
  const [form] = Form.useForm();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const iterations = appStore.getIterationsByAppId(appId);
  const ongoingIterations = iterations.filter(
    i => i.status === IterationStatus.BUILDING || i.status === IterationStatus.PENDING
  );

  const handleCreateIteration = async () => {
    try {
      const values = await form.validateFields();
      appStore.addIteration(appId, {
        branchName: values.branchName,
        description: values.description || ''
      });
      message.success('迭代创建成功');
      setShowCreateModal(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleBatchDiscard = () => {
    Modal.confirm({
      title: '确认废弃',
      content: '确定要废弃所有进行中的迭代吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('批量废弃成功');
      }
    });
  };

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
        if (status === IterationStatus.BUILDING) {
          return (
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
          );
        }
        return (
          <span 
            className={styles.statusPending}
            style={{
              color: IterationStatus.getColor(IterationStatus.PENDING),
              background: IterationStatus.getBgColor(IterationStatus.PENDING)
            }}
          >
            {IterationStatus.getLabel(IterationStatus.PENDING)}
          </span>
        );
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
      render: () => <span className={styles.envBadge}>测试环境</span>
    }
  ];

  return (
    <>
      <div className={styles.appInfoSection}>
        <h3 className={styles.sectionTitle}>应用详情</h3>
        <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>应用标识</span>
                <span className={styles.infoValue}>{app.appId}</span>
              </div>
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
            <Button 
              type="primary" 
              icon={<span style={{ fontSize: '16px' }}>+</span>}
              onClick={() => setShowCreateModal(true)}
            >
              创建迭代
            </Button>
            <Button danger onClick={handleBatchDiscard}>
              快速废弃迭代
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={ongoingIterations}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <div className={styles.emptyTable}>
                <div className={styles.emptyIcon}>📋</div>
                <p>暂无进行中的迭代</p>
              </div>
            )
          }}
        />
      </div>

      <Modal
        title="新建代码迭代"
        open={showCreateModal}
        onOk={handleCreateIteration}
        onCancel={() => {
          setShowCreateModal(false);
          form.resetFields();
        }}
        okText="创建并构建"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="分支名称"
            name="branchName"
            rules={[{ required: true, message: '请输入分支名称' }]}
          >
            <Input placeholder="例如: feature/new-function" size="large" />
          </Form.Item>
          <Form.Item
            label="迭代描述"
            name="description"
          >
            <TextArea 
              placeholder="请描述本次迭代的主要内容（可选）" 
              rows={4}
              size="large"
            />
          </Form.Item>
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
        </Form>
      </Modal>
    </>
  );
});

export default OverviewTab;
