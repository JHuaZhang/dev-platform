import { Context } from 'egg';

export default () => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
      await next();
    } catch (err: any) {
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? '服务器内部错误'
        : err.message;

      ctx.body = {
        code: status,
        message: error,
        data: null,
      };
      ctx.status = status;
    }
  };
};
