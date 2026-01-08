import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo): PowerPartial<EggAppConfig> => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1234567890';

  config.middleware = ['errorHandler'];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.mysql = {
    client: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3306',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'publish_platform',
    },
    app: true,
    agent: false,
  };

  config.redis = {
    client: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || '',
      db: 0,
    },
  };

  config.jwt = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    enable: true,
    ignore: ['/api/auth/login', '/api/auth/register'],
  };

  config.validate = {
    convert: true,
    widelyUndefined: true,
  };

  return {
    ...config,
  };
};
