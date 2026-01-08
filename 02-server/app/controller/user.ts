import { Controller } from 'egg';
import * as bcrypt from 'bcryptjs';

export default class UserController extends Controller {
  public async list() {
    const { ctx, app } = this;
    const { page = 1, pageSize = 10, keyword } = ctx.query;

    let sql = 'SELECT id, username, nickname, email, created_at FROM users WHERE 1=1';
    const params: any[] = [];

    if (keyword) {
      sql += ' AND (username LIKE ? OR nickname LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize;
    params.push(pageSizeNum, (pageNum - 1) * pageSizeNum);

    const list = await app.mysql.query(sql, params);
    const total = await app.mysql.count('users');

    ctx.helper.success({
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  public async create() {
    const { ctx, app } = this;
    const { username, password, nickname, email } = ctx.request.body;

    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true, min: 6 },
      nickname: { type: 'string', required: true },
      email: { type: 'email', required: true },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await app.mysql.insert('users', {
      username,
      password: hashedPassword,
      nickname,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    ctx.helper.success({ id: result.insertId }, '创建成功');
  }

  public async update() {
    const { ctx, app } = this;
    const { id } = ctx.params;
    const { nickname, email } = ctx.request.body;

    const result = await app.mysql.update('users', {
      id,
      nickname,
      email,
      updated_at: new Date(),
    });

    if (result.affectedRows === 0) {
      ctx.helper.error('更新失败', 400);
      return;
    }

    ctx.helper.success(null, '更新成功');
  }

  public async destroy() {
    const { ctx, app } = this;
    const { id } = ctx.params;

    const result = await app.mysql.delete('users', { id });

    if (result.affectedRows === 0) {
      ctx.helper.error('删除失败', 400);
      return;
    }

    ctx.helper.success(null, '删除成功');
  }
}
