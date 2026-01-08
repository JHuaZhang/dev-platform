import { Controller } from 'egg';

export default class PermissionController extends Controller {
  public async list() {
    const { ctx } = this;
    const { userId, appId } = ctx.query;

    const query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (appId) {
      query.appId = appId;
    }

    const list = await ctx.model.Permission.find(query)
      .populate('userId', 'username nickname')
      .populate('appId', 'name')
      .lean();

    ctx.helper.success({ list });
  }

  public async grant() {
    const { ctx } = this;
    const { userId, appId, role } = ctx.request.body;

    ctx.validate({
      userId: { type: 'string', required: true },
      appId: { type: 'string', required: true },
      role: { type: 'enum', values: ['owner', 'developer', 'viewer'], required: true },
    });

    const exist = await ctx.model.Permission.findOne({ userId, appId });

    if (exist) {
      ctx.helper.error('权限已存在', 400);
      return;
    }

    const permission = await ctx.model.Permission.create({
      userId,
      appId,
      role,
    });

    ctx.helper.success({ id: permission._id }, '授权成功');
  }

  public async revoke() {
    const { ctx } = this;
    const { id } = ctx.params;

    const result = await ctx.model.Permission.deleteOne({ _id: id });

    if ((result as any).deletedCount === 0) {
      ctx.helper.error('删除失败', 400);
      return;
    }

    ctx.helper.success(null, '撤销成功');
  }
}
