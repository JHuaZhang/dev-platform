import { Controller } from 'egg';

export default class AppController extends Controller {
  public async list() {
    const { ctx, app } = this;
    const { page = 1, pageSize = 10, keyword } = ctx.query;

    let sql = 'SELECT * FROM apps WHERE 1=1';
    const params: any[] = [];

    if (keyword) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize;
    params.push(pageSizeNum, (pageNum - 1) * pageSizeNum);

    const list = await app.mysql.query(sql, params);
    const total = await app.mysql.count('apps');

    ctx.helper.success({
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  public async create() {
    const { ctx, app } = this;
    const { name, description, repository, type } = ctx.request.body;

    ctx.validate({
      name: { type: 'string', required: true },
      description: { type: 'string', required: false },
      repository: { type: 'string', required: true },
      type: { type: 'string', required: true },
    });

    const result = await app.mysql.insert('apps', {
      name,
      description,
      repository,
      type,
      created_at: new Date(),
      updated_at: new Date(),
    });

    ctx.body = {
      code: 200,
      message: '创建成功',
      data: { id: result.insertId },
    };
  }

  public async show() {
    const { ctx, app } = this;
    const { id } = ctx.params;

    const app_data = await app.mysql.get('apps', { id });

    if (!app_data) {
      ctx.body = {
        code: 404,
        message: '应用不存在',
        data: null,
      };
      ctx.status = 404;
      return;
    }

    ctx.body = {
      code: 200,
      message: '操作成功',
      data: app_data,
    };
  }

  public async update() {
    const { ctx, app } = this;
    const { id } = ctx.params;
    const { name, description, repository, type } = ctx.request.body;

    const result = await app.mysql.update('apps', {
      id,
      name,
      description,
      repository,
      type,
      updated_at: new Date(),
    });

    if (result.affectedRows === 0) {
      ctx.body = {
        code: 400,
        message: '更新失败',
        data: null,
      };
      ctx.status = 400;
      return;
    }

    ctx.body = {
      code: 200,
      message: '更新成功',
      data: null,
    };
  }

  public async destroy() {
    const { ctx, app } = this;
    const { id } = ctx.params;

    const result = await app.mysql.delete('apps', { id });

    if (result.affectedRows === 0) {
      ctx.body = {
        code: 400,
        message: '删除失败',
        data: null,
      };
      ctx.status = 400;
      return;
    }

    ctx.body = {
      code: 200,
      message: '删除成功',
      data: null,
    };
  }
}
