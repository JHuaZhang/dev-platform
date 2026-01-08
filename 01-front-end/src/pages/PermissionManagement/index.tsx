import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Table, Button, Form, Select, message, Tag, Space, Transfer, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TransferProps } from 'antd/es/transfer';
import type { Key } from 'react';
import styles from './index.module.css';

const { Option } = Select;

interface Permission {
  userId: number;
  username: string;
  name: string;
  role: string;
  permissions: {
    apps: string[];
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

interface App {
  key: string;
  title: string;
  description: string;
}

const PermissionManagement = observer(() => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Permission | null>(null);
  const [targetKeys, setTargetKeys] = useState<Key[]>([]);
  
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      userId: 2,
      username: 'zhangsan',
      name: '张三',
      role: 'developer',
      permissions: {
        apps: ['ec-plat'],
        canCreate: true,
        canEdit: true,
        canDelete: false
      }
    },
    {
      userId: 3,
      username: 'lisi',
      name: '李四',
      role: 'viewer',
      permissions: {
        apps: ['ec-plat', 'admin-sys'],
        canCreate: false,
        canEdit: false,
        canDelete: false
      }
    }
  ]);

  const allApps: App[] = [
    { key: 'ec-plat', title: '电商平台', description: '主要的电商业务平台' },
    { key: 'admin-sys', title: '管理后台', description: '运营管理后台系统' }
  ];

  const handleEdit = (record: Permission) => {
    setEditingUser(record);
    setTargetKeys(record.permissions.apps);
    form.setFieldsValue({
      canCreate: record.permissions.canCreate,
      canEdit: record.permissions.canEdit,
      canDelete: record.permissions.canDelete
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        setPermissions(permissions.map(p => 
          p.userId === editingUser.userId 
            ? {
                ...p,
                permissions: {
                  apps: targetKeys.map(key => String(key)),
                  canCreate: values.canCreate,
                  canEdit: values.canEdit,
                  canDelete: values.canDelete
                }
              }
            : p
        ));
        message.success('权限更新成功');
      }
      
      setShowModal(false);
      form.resetFields();
      setTargetKeys([]);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleTransferChange: TransferProps['onChange'] = (
    newTargetKeys
  ) => {
    setTargetKeys(newTargetKeys);
  };

  const getPermissionTags = (permission: Permission) => {
    const tags = [];
    if (permission.permissions.canCreate) tags.push(<Tag color="green" key="create">创建</Tag>);
    if (permission.permissions.canEdit) tags.push(<Tag color="blue" key="edit">编辑</Tag>);
    if (permission.permissions.canDelete) tags.push(<Tag color="red" key="delete">删除</Tag>);
    if (tags.length === 0) tags.push(<Tag color="default" key="view">仅查看</Tag>);
    return tags;
  };

  const columns: ColumnsType<Permission> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => {
        const roleMap = {
          admin: { color: 'red', text: '管理员' },
          developer: { color: 'blue', text: '开发者' },
          viewer: { color: 'default', text: '访客' }
        };
        const config = roleMap[role as keyof typeof roleMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '可访问应用',
      key: 'apps',
      render: (_: unknown, record: Permission) => (
        <Space size="small" wrap>
          {record.permissions.apps.length > 0 ? (
            record.permissions.apps.map(appId => {
              const app = allApps.find(a => a.key === appId);
              return <Tag key={appId}>{app?.title || appId}</Tag>;
            })
          ) : (
            <Tag color="default">无权限</Tag>
          )}
        </Space>
      )
    },
    {
      title: '操作权限',
      key: 'operations',
      width: 200,
      render: (_: unknown, record: Permission) => (
        <Space size="small" wrap>
          {getPermissionTags(record)}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Permission) => (
        <Button 
          type="link" 
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑权限
        </Button>
      )
    }
  ];

  return (
    <div className={styles.permissionManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>权限管理</h1>
          <p className={styles.subtitle}>管理用户的应用访问和操作权限</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>总用户数</div>
              <div className={styles.statValue}>{permissions.length}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>有权限用户</div>
              <div className={styles.statValue}>
                {permissions.filter(p => p.permissions.apps.length > 0).length}
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>应用总数</div>
              <div className={styles.statValue}>{allApps.length}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔒</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>受限用户</div>
              <div className={styles.statValue}>
                {permissions.filter(p => !p.permissions.canCreate && !p.permissions.canEdit).length}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={permissions}
            rowKey="userId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
          />
        </div>
      </div>

      <Modal
        title="编辑用户权限"
        open={showModal}
        onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
          setTargetKeys([]);
        }}
        okText="确定"
        cancelText="取消"
        width={700}
      >
        {editingUser && (
          <div style={{ marginBottom: '20px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#4a5568' }}>
              <strong>用户：</strong>{editingUser.name} ({editingUser.username})
            </div>
          </div>
        )}

        <Form form={form} layout="vertical">
          <Form.Item label="可访问应用">
            <Transfer
              dataSource={allApps}
              titles={['可选应用', '已授权应用']}
              targetKeys={targetKeys}
              onChange={handleTransferChange}
              render={item => item.title}
              listStyle={{
                width: 280,
                height: 300
              }}
            />
          </Form.Item>

          <Form.Item
            label="操作权限"
            style={{ marginTop: '20px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="canCreate"
                valuePropName="checked"
                style={{ marginBottom: '8px' }}
              >
                <Select placeholder="创建权限" style={{ width: '100%' }}>
                  <Option value={true}>允许创建应用和迭代</Option>
                  <Option value={false}>禁止创建</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="canEdit"
                valuePropName="checked"
                style={{ marginBottom: '8px' }}
              >
                <Select placeholder="编辑权限" style={{ width: '100%' }}>
                  <Option value={true}>允许编辑应用和迭代</Option>
                  <Option value={false}>禁止编辑</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="canDelete"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Select placeholder="删除权限" style={{ width: '100%' }}>
                  <Option value={true}>允许删除应用和迭代</Option>
                  <Option value={false}>禁止删除</Option>
                </Select>
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>

        <div className={styles.tips}>
          <div className={styles.tipsIcon}>💡</div>
          <div className={styles.tipsContent}>
            <p className={styles.tipsTitle}>权限说明</p>
            <ul>
              <li>用户只能访问已授权的应用</li>
              <li>创建权限：允许创建新应用和代码迭代</li>
              <li>编辑权限：允许修改应用配置和迭代信息</li>
              <li>删除权限：允许删除应用和废弃迭代</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default PermissionManagement;
