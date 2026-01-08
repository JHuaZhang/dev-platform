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

  config.mongoose = {
    client: {
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017/publish_platform',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
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
