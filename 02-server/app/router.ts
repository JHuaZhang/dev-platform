import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/auth/login', controller.auth.login);
  router.post('/api/auth/register', controller.auth.register);

  router.get('/api/apps', controller.app.list);
  router.post('/api/apps', controller.app.create);
  router.get('/api/apps/:id', controller.app.show);
  router.put('/api/apps/:id', controller.app.update);
  router.delete('/api/apps/:id', controller.app.destroy);

  router.get('/api/iterations', controller.iteration.list);
  router.post('/api/iterations', controller.iteration.create);
  router.get('/api/iterations/:id', controller.iteration.show);

  router.get('/api/users', controller.user.list);
  router.post('/api/users', controller.user.create);
  router.put('/api/users/:id', controller.user.update);
  router.delete('/api/users/:id', controller.user.destroy);

  router.get('/api/permissions', controller.permission.list);
  router.post('/api/permissions', controller.permission.grant);
  router.delete('/api/permissions/:id', controller.permission.revoke);
};
