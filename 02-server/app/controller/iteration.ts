import { Controller } from 'egg';

export default class IterationController extends Controller {
  public async list() {
    const { ctx, app } = this;
    const { page = 1, pageSize = 10, appId } = ctx.query;

    let sql = 'SELECT * FROM iterations WHERE 1=1';
    const params: any[] = [];

    if (appId) {
      sql += ' AND app_id = ?';
      params.push(appId);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize;
    params.push(pageSizeNum, (pageNum - 1) * pageSizeNum);

    const list = await app.mysql.query(sql, params);
    const total = await app.mysql.count('iterations', appId ? { app_id: appId } : {});

    ctx.helper.success({
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  public async create() {
    const { ctx, app } = this;
    const { appId, version, branch, commitId, description } = ctx.request.body;

    ctx.validate({
      appId: { type: 'number', required: true },
      version: { type: 'string', required: true },
      branch: { type: 'string', required: true },
      commitId: { type: 'string', required: true },
    });

    const result = await app.mysql.insert('iterations', {
      app_id: appId,
      version,
      branch,
      commit_id: commitId,
      description,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    ctx.helper.success({ id: result.insertId }, '创建成功');
  }

  public async show() {
    const { ctx, app } = this;
    const { id } = ctx.params;

    const iteration = await app.mysql.get('iterations', { id });

    if (!iteration) {
      ctx.helper.error('迭代不存在', 404);
      return;
    }

    ctx.helper.success(iteration);
  }
}
