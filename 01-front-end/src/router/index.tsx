import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { routeConfig, type RouteItem } from './config';

const PrivateRoute = lazy(() => import('@/components/PrivateRoute'));

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

const renderRoutes = (routes: RouteItem[]) => {
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
    const isLoginRoute = route.path === '/login';
    
    const element = Element ? (
      <Suspense fallback={<Loading />}>
        {isLoginRoute ? (
          <Element />
        ) : (
          <PrivateRoute>
            <Element />
          </PrivateRoute>
        )}
      </Suspense>
    ) : null;

    if (route.children && route.children.length > 0) {
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
