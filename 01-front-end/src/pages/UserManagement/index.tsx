import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.css';

const { Option } = Select;

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive';
  createTime: string;
}

const UserManagement = observer(() => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: 'admin',
      name: '管理员',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createTime: '2024-01-01 10:00:00'
    },
    {
      id: 2,
      username: 'zhangsan',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'developer',
      status: 'active',
      createTime: '2024-01-05 14:30:00'
    },
    {
      id: 3,
      username: 'lisi',
      name: '李四',
      email: 'lisi@example.com',
      role: 'viewer',
      status: 'active',
      createTime: '2024-01-10 09:15:00'
    }
  ]);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${user.name}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        setUsers(users.filter(u => u.id !== user.id));
        message.success('删除成功');
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...values }
            : u
        ));
        message.success('更新成功');
      } else {
        const newUser: User = {
          ...values,
          id: Date.now(),
          createTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        };
        setUsers([newUser, ...users]);
        message.success('添加成功');
      }
      
      setShowModal(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getRoleTag = (role: string) => {
    const roleMap = {
      admin: { color: 'red', text: '管理员' },
      developer: { color: 'blue', text: '开发者' },
      viewer: { color: 'default', text: '访客' }
    };
    const config = roleMap[role as keyof typeof roleMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status: string) => {
    return status === 'active' 
      ? <Tag color="success">正常</Tag>
      : <Tag color="default">禁用</Tag>;
  };

  const columns: ColumnsType<User> = [
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
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => getRoleTag(role)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            disabled={record.username === 'admin'}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>用户编辑</h1>
          <p className={styles.subtitle}>管理系统用户信息</p>
        </div>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className={styles.addBtn}
        >
          添加用户
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>总用户数</div>
              <div className={styles.statValue}>{users.length}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👨‍💼</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>管理员</div>
              <div className={styles.statValue}>
                {users.filter(u => u.role === 'admin').length}
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👨‍💻</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>开发者</div>
              <div className={styles.statValue}>
                {users.filter(u => u.role === 'developer').length}
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>活跃用户</div>
              <div className={styles.statValue}>
                {users.filter(u => u.status === 'active').length}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
          />
        </div>
      </div>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={showModal}
        onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: '用户名只能包含字母、数字和下划线，长度3-20位' }
            ]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="developer">开发者</Option>
              <Option value="viewer">访客</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default UserManagement;
