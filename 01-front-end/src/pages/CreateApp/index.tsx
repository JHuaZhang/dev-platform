import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStores } from '@/stores';
import styles from './index.module.css';

interface Template {
  id: string;
  name: string;
  description: string;
  gitlabUrl: string;
}

const CreateApp = observer(() => {
  const { appStore } = useStores();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [appName, setAppName] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [gitlabUrl, setGitlabUrl] = useState('');
  const [jenkinsUrl, setJenkinsUrl] = useState('');

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

  const handleNext = () => {
    if (currentStep === 1) {
      if (!appName.trim()) {
        alert('请输入应用名称');
        return;
      }
      if (!appUrl.trim()) {
        alert('请输入应用地址');
        return;
      }
      if (!selectedTemplate) {
        alert('请选择应用模板');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    if (!gitlabUrl.trim()) {
      alert('请输入 GitLab 地址');
      return;
    }
    if (!jenkinsUrl.trim()) {
      alert('请输入 Jenkins 地址');
      return;
    }
    appStore.addApp({
      name: appName,
      description: appDesc,
      gitlabUrl,
      jenkinsUrl
    });
    navigate('/apps');
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
          {currentStep === 1 && (
            <>
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>基本信息</h2>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    应用名称 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="请输入应用名称"
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                  />
                  <p className={styles.hint}>应用的唯一标识名称</p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>应用描述</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="请输入应用描述（可选）"
                    rows={3}
                    value={appDesc}
                    onChange={e => setAppDesc(e.target.value)}
                  />
                  <p className={styles.hint}>简要描述应用的功能和用途</p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    应用地址 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://your-app.example.com"
                    value={appUrl}
                    onChange={e => setAppUrl(e.target.value)}
                  />
                  <p className={styles.hint}>应用的访问地址</p>
                </div>
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
                <button className={styles.nextBtn} onClick={handleNext}>
                  下一步 →
                </button>
                <button className={styles.cancelBtn} onClick={() => navigate('/apps')}>
                  取消
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>配置信息</h2>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    GitLab 地址 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://gitlab.com/your-project"
                    value={gitlabUrl}
                    onChange={e => setGitlabUrl(e.target.value)}
                  />
                  <p className={styles.hint}>代码仓库的 GitLab 地址</p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Jenkins 地址 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://jenkins.com/your-project"
                    value={jenkinsUrl}
                    onChange={e => setJenkinsUrl(e.target.value)}
                  />
                  <p className={styles.hint}>持续集成的 Jenkins 地址</p>
                </div>
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
                <button className={styles.submitBtn} onClick={handleSubmit}>
                  创建应用
                </button>
                <button className={styles.prevBtn} onClick={handlePrev}>
                  ← 上一步
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default CreateApp;
