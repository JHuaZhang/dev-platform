import { lazy } from 'react';

const Layout = lazy(() => import('@/components/Layout'));
const Login = lazy(() => import('@/pages/Login'));
const AppList = lazy(() => import('@/pages/AppList'));
const CreateApp = lazy(() => import('@/pages/CreateApp'));
const AppDetail = lazy(() => import('@/pages/AppDetail'));
const IterationHistory = lazy(() => import('@/pages/IterationHistory'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const PermissionManagement = lazy(() => import('@/pages/PermissionManagement'));

export interface RouteItem {
  path: string;
  element?: React.LazyExoticComponent<() => JSX.Element>;
  children?: RouteItem[];
  title?: string;
  closable?: boolean;
  redirect?: string;
}

export const routeConfig: RouteItem[] = [
  {
    path: '/login',
    element: Login
  },
  {
    path: '/',
    element: Layout,
    children: [
      {
        path: '',
        redirect: '/apps'
      },
      {
        path: 'apps',
        element: AppList,
        title: '应用管理',
        closable: false
      },
      {
        path: 'apps/create',
        element: CreateApp,
        title: '新建应用',
        closable: true
      },
      {
        path: 'apps/:appIdentifier',
        element: AppDetail,
        title: '应用详情',
        closable: true
      },
      {
        path: 'apps/:appIdentifier/history',
        element: IterationHistory,
        title: '迭代历史',
        closable: true
      },
      {
        path: 'users',
        element: UserManagement,
        title: '用户编辑',
        closable: false
      },
      {
        path: 'permissions',
        element: PermissionManagement,
        title: '权限管理',
        closable: false
      }
    ]
  }
];
