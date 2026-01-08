import { Controller } from 'egg';

export default class PermissionController extends Controller {
  public async list() {
    const { ctx, app } = this;
    const { userId, appId } = ctx.query;

    let sql = `
      SELECT p.*, u.username, u.nickname, a.name as app_name
      FROM permissions p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN apps a ON p.app_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (userId) {
      sql += ' AND p.user_id = ?';
      params.push(userId);
    }

    if (appId) {
      sql += ' AND p.app_id = ?';
      params.push(appId);
    }

    const list = await app.mysql.query(sql, params);

    ctx.helper.success({ list });
  }

  public async grant() {
    const { ctx, app } = this;
    const { userId, appId, role } = ctx.request.body;

    ctx.validate({
      userId: { type: 'number', required: true },
      appId: { type: 'number', required: true },
      role: { type: 'enum', values: ['owner', 'developer', 'viewer'], required: true },
    });

    const exist = await app.mysql.get('permissions', { user_id: userId, app_id: appId });

    if (exist) {
      ctx.helper.error('权限已存在', 400);
      return;
    }

    const result = await app.mysql.insert('permissions', {
      user_id: userId,
      app_id: appId,
      role,
      created_at: new Date(),
    });

    ctx.helper.success({ id: result.insertId }, '授权成功');
  }

  public async revoke() {
    const { ctx, app } = this;
    const { id } = ctx.params;

    const result = await app.mysql.delete('permissions', { id });

    if (result.affectedRows === 0) {
      ctx.helper.error('删除失败', 400);
      return;
    }

    ctx.helper.success(null, '撤销成功');
  }
}
