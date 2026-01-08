export default {
  success(data: any = null, msg = '操作成功') {
    const ctx = (this as any).ctx;
    ctx.body = {
      code: 200,
      message: msg,
      data,
    };
    ctx.status = 200;
  },

  error(msg = '操作失败', code = 400) {
    const ctx = (this as any).ctx;
    ctx.body = {
      code,
      message: msg,
      data: null,
    };
    ctx.status = code;
  },
};
