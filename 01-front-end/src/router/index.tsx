import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Layout = lazy(() => import('@/components/Layout'));
const AppList = lazy(() => import('@/pages/AppList'));
const CreateApp = lazy(() => import('@/pages/CreateApp'));
const AppDetail = lazy(() => import('@/pages/AppDetail'));
const IterationHistory = lazy(() => import('@/pages/IterationHistory'));

interface RouteConfig {
  path: string;
  element?: React.LazyExoticComponent<() => JSX.Element>;
  children?: RouteConfig[];
  redirect?: string;
}

const routeConfig: RouteConfig[] = [
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
        element: AppList
      },
      {
        path: 'apps/create',
        element: CreateApp
      },
      {
        path: 'apps/:appId',
        element: AppDetail
      },
      {
        path: 'apps/:appId/history',
        element: IterationHistory
      }
    ]
  }
];

const Loading = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '16px',
    color: '#667eea'
  }}>
    加载中...
  </div>
);

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => {
    if (route.redirect) {
      return (
        <Route
          key={index}
          path={route.path}
          element={<Navigate to={route.redirect} replace />}
        />
      );
    }

    const Element = route.element;
    const element = Element ? (
      <Suspense fallback={<Loading />}>
        <Element />
      </Suspense>
    ) : null;

    if (route.children) {
      return (
        <Route key={index} path={route.path} element={element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return <Route key={index} path={route.path} element={element} />;
  });
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routeConfig)}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
