import { makeAutoObservable } from 'mobx';
import { IterationStatus } from '@/types/enum';

export interface App {
  id: number;
  name: string;
  description: string;
  gitlabUrl: string;
  jenkinsUrl: string;
  iterationCount: number;
  lastUpdate: string;
  hasPermission: boolean;
}

export interface Iteration {
  id: number;
  appId: number;
  branchName: string;
  description: string;
  status: IterationStatus;
  createTime: string;
  buildDuration?: string;
}

class AppStore {
  appList: App[] = [
    {
      id: 1,
      name: '电商平台',
      description: '主要的电商业务平台',
      gitlabUrl: 'https://gitlab.com/ecommerce',
      jenkinsUrl: 'https://jenkins.com/ecommerce',
      iterationCount: 12,
      lastUpdate: '2024-01-15',
      hasPermission: true
    },
    {
      id: 2,
      name: '管理后台',
      description: '运营管理后台系统',
      gitlabUrl: 'https://gitlab.com/admin',
      jenkinsUrl: 'https://jenkins.com/admin',
      iterationCount: 8,
      lastUpdate: '2024-01-14',
      hasPermission: false
    }
  ];

  iterations: Iteration[] = [
    {
      id: 1,
      appId: 1,
      branchName: 'feature/shopping-cart',
      description: '优化购物车交互体验',
      status: IterationStatus.SUCCESS,
      createTime: '2024-01-15 14:30',
      buildDuration: '3分25秒'
    },
    {
      id: 2,
      appId: 1,
      branchName: 'feature/payment-flow',
      description: '重构支付流程',
      status: IterationStatus.SUCCESS,
      createTime: '2024-01-14 10:20',
      buildDuration: '4分12秒'
    },
    {
      id: 3,
      appId: 1,
      branchName: 'hotfix/order-bug',
      description: '修复订单状态异常问题',
      status: IterationStatus.FAILED,
      createTime: '2024-01-13 16:45',
      buildDuration: '2分08秒'
    },
    {
      id: 4,
      appId: 2,
      branchName: 'feature/user-management',
      description: '新增用户管理功能',
      status: IterationStatus.BUILDING,
      createTime: '2024-01-15 15:00'
    }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  addApp(data: Omit<App, 'id' | 'iterationCount' | 'lastUpdate'>) {
    const newApp: App = {
      ...data,
      id: Date.now(),
      iterationCount: 0,
      lastUpdate: new Date().toISOString().split('T')[0],
      hasPermission: true
    };
    this.appList.unshift(newApp);
  }

  addIteration(appId: number, data: Omit<Iteration, 'id' | 'appId' | 'status' | 'createTime'>) {
    const newIteration: Iteration = {
      ...data,
      id: Date.now(),
      appId,
      status: IterationStatus.PENDING,
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    this.iterations.unshift(newIteration);
    
    const app = this.appList.find(a => a.id === appId);
    if (app) {
      app.iterationCount += 1;
      app.lastUpdate = new Date().toISOString().split('T')[0];
    }

    setTimeout(() => {
      newIteration.status = IterationStatus.BUILDING;
    }, 1000);

    setTimeout(() => {
      newIteration.status = Math.random() > 0.2 ? IterationStatus.SUCCESS : IterationStatus.FAILED;
      newIteration.buildDuration = `${Math.floor(Math.random() * 5) + 2}分${Math.floor(Math.random() * 60)}秒`;
    }, 5000);
  }

  getIterationsByAppId(appId: number) {
    return this.iterations.filter(i => i.appId === appId);
  }
}

export default new AppStore();
