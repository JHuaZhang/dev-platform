import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useStores } from '@/stores';
import { Form, Input, Button, Modal } from 'antd';
import styles from './index.module.css';

const { TextArea } = Input;

interface Template {
  id: string;
  name: string;
  description: string;
  gitlabUrl: string;
}

const CreateApp = observer(() => {
  const { appStore } = useStores();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    // 尝试从 sessionStorage 恢复表单状态
    const savedFormData = sessionStorage.getItem('createAppFormData');
    const savedStep = sessionStorage.getItem('createAppStep');
    const savedTemplate = sessionStorage.getItem('createAppTemplate');

    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      form.setFieldsValue(formData);
    } else {
      // 初始化时自动生成应用标识
      let newAppId = appStore.generateAppId();
      while (appStore.isAppIdExists(newAppId)) {
        newAppId = appStore.generateAppId();
      }
      form.setFieldsValue({ appId: newAppId });
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }

    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }

    hasInitialized.current = true;
  }, [appStore, form]);

  // 监听表单字段变化，实时保存
  const handleFormChange = () => {
    const formData = form.getFieldsValue();
    sessionStorage.setItem('createAppFormData', JSON.stringify(formData));
  };

  // 监听步骤和模板变化
  useEffect(() => {
    sessionStorage.setItem('createAppStep', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem('createAppTemplate', selectedTemplate);
  }, [selectedTemplate]);

  useEffect(() => {
    // 模拟从 GitLab 获取模板列表
    // 实际使用时替换为真实的 API 调用
    const mockTemplates: Template[] = [
      {
        id: 'react-template',
        name: 'React 应用模板',
        description: '基于 React + TypeScript + Vite 的现代化前端应用模板',
        gitlabUrl: 'https://gitlab.com/templates/react-app'
      },
      {
        id: 'vue-template',
        name: 'Vue 应用模板',
        description: '基于 Vue 3 + TypeScript + Vite 的前端应用模板',
        gitlabUrl: 'https://gitlab.com/templates/vue-app'
      },
      {
        id: 'node-template',
        name: 'Node.js 服务模板',
        description: '基于 Express + TypeScript 的后端服务模板',
        gitlabUrl: 'https://gitlab.com/templates/node-service'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const clearFormData = () => {
    sessionStorage.removeItem('createAppFormData');
    sessionStorage.removeItem('createAppStep');
    sessionStorage.removeItem('createAppTemplate');
  };

  const handleGenerateAppId = () => {
    let newAppId = appStore.generateAppId();
    while (appStore.isAppIdExists(newAppId)) {
      newAppId = appStore.generateAppId();
    }
    form.setFieldsValue({ appId: newAppId });
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      try {
        await form.validateFields(['appName', 'appId', 'appUrl']);
        if (!selectedTemplate) {
          alert('请选择应用模板');
          return;
        }
        setCurrentStep(2);
      } catch (error) {
        console.error('表单验证失败:', error);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      appStore.addApp({
        appId: values.appId,
        name: values.appName,
        description: values.appDesc || '',
        gitlabUrl: values.gitlabUrl,
        jenkinsUrl: values.jenkinsUrl
      });
      clearFormData();
      navigate('/apps');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    const formData = form.getFieldsValue();
    const hasData = Object.values(formData).some(value => value && value !== '');

    if (hasData || selectedTemplate) {
      Modal.confirm({
        title: '确认取消',
        content: '表单中有未保存的内容，确定要取消吗？',
        okText: '确定',
        cancelText: '继续编辑',
        onOk() {
          clearFormData();
          navigate('/apps');
        }
      });
    } else {
      clearFormData();
      navigate('/apps');
    }
  };

  return (
    <div className={styles.createApp}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/apps')}>
          ← 返回
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>新建应用</h1>
          <p className={styles.subtitle}>创建一个新的应用项目</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.steps}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.stepActive : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepLabel}>基本信息</div>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.stepActive : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepLabel}>配置信息</div>
          </div>
        </div>

        <div className={styles.formCard}>
          <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
            {currentStep === 1 && (
              <>
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>基本信息</h2>
                  <Form.Item
                    label="应用名称"
                    name="appName"
                    rules={[{ required: true, message: '请输入应用名称' }]}
                    extra="应用的显示名称"
                  >
                    <Input placeholder="请输入应用名称" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="应用标识"
                    name="appId"
                    rules={[
                      { required: true, message: '请输入应用标识' },
                      { pattern: /^[a-z0-9-]{3,20}$/, message: '应用标识只能包含小写字母、数字和连字符，长度3-20位' },
                      {
                        validator: async (_, value) => {
                          if (value && appStore.isAppIdExists(value)) {
                            throw new Error('应用标识已存在');
                          }
                        }
                      }
                    ]}
                    extra="应用的唯一标识，用于URL和系统识别"
                  >
                    <Input 
                      placeholder="请输入应用标识，如：ec-platform" 
                      size="large"
                      addonAfter={
                        <Button 
                          type="link" 
                          size="small"
                          onClick={handleGenerateAppId}
                          style={{ padding: '0 8px' }}
                        >
                          自动生成
                        </Button>
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="应用描述"
                    name="appDesc"
                    extra="简要描述应用的功能和用途"
                  >
                    <TextArea 
                      placeholder="请输入应用描述（可选）" 
                      rows={3}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="应用地址"
                    name="appUrl"
                    rules={[
                      { required: true, message: '请输入应用地址' },
                      { type: 'url', message: '请输入有效的URL地址' }
                    ]}
                    extra="应用的访问地址"
                  >
                    <Input 
                      placeholder="https://your-app.example.com" 
                      size="large"
                    />
                  </Form.Item>
                </div>

              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  选择模板 <span className={styles.required}>*</span>
                </h2>
                <div className={styles.templateGrid}>
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className={`${styles.templateCard} ${
                        selectedTemplate === template.id ? styles.templateCardSelected : ''
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className={styles.templateIcon}>📦</div>
                      <h3 className={styles.templateName}>{template.name}</h3>
                      <p className={styles.templateDesc}>{template.description}</p>
                      {selectedTemplate === template.id && (
                        <div className={styles.selectedBadge}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

                <div className={styles.actions}>
                  <Button type="primary" size="large" onClick={handleNext}>
                    下一步 →
                  </Button>
                  <Button size="large" onClick={handleCancel}>
                    取消
                  </Button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>配置信息</h2>
                  <Form.Item
                    label="GitLab 地址"
                    name="gitlabUrl"
                    rules={[
                      { required: true, message: '请输入 GitLab 地址' },
                      { type: 'url', message: '请输入有效的URL地址' }
                    ]}
                    extra="代码仓库的 GitLab 地址"
                  >
                    <Input 
                      placeholder="https://gitlab.com/your-project" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Jenkins 地址"
                    name="jenkinsUrl"
                    rules={[
                      { required: true, message: '请输入 Jenkins 地址' },
                      { type: 'url', message: '请输入有效的URL地址' }
                    ]}
                    extra="持续集成的 Jenkins 地址"
                  >
                    <Input 
                      placeholder="https://jenkins.com/your-project" 
                      size="large"
                    />
                  </Form.Item>
                </div>

              <div className={styles.tips}>
                <div className={styles.tipsIcon}>💡</div>
                <div className={styles.tipsContent}>
                  <p className={styles.tipsTitle}>配置提示</p>
                  <ul>
                    <li>GitLab 地址用于代码仓库管理和版本控制</li>
                    <li>Jenkins 地址用于自动化构建和部署</li>
                    <li>配置完成后可以在应用设置中修改</li>
                  </ul>
                </div>
              </div>

                <div className={styles.actions}>
                  <Button type="primary" size="large" onClick={handleSubmit}>
                    创建应用
                  </Button>
                  <Button size="large" onClick={handlePrev}>
                    ← 上一步
                  </Button>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
});

export default CreateApp;
