import { Controller } from 'egg';
import * as bcrypt from 'bcryptjs';

export default class UserController extends Controller {
  public async list() {
    const { ctx } = this;
    const { page = 1, pageSize = 10, keyword } = ctx.query;

    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize;

    const query: any = {};
    if (keyword) {
      query.$or = [
        { username: new RegExp(keyword as string, 'i') },
        { nickname: new RegExp(keyword as string, 'i') },
      ];
    }

    const list = await ctx.model.User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .lean();

    const total = await ctx.model.User.countDocuments(query);

    ctx.helper.success({
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  public async create() {
    const { ctx } = this;
    const { username, password, nickname, email } = ctx.request.body;

    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true, min: 6 },
      nickname: { type: 'string', required: true },
      email: { type: 'email', required: true },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await ctx.model.User.create({
      username,
      password: hashedPassword,
      nickname,
      email,
    });

    ctx.helper.success({ id: user._id }, '创建成功');
  }

  public async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { nickname, email } = ctx.request.body;

    const result = await ctx.model.User.updateOne(
      { _id: id },
      { nickname, email }
    );

    if ((result as any).modifiedCount === 0) {
      ctx.helper.error('更新失败', 400);
      return;
    }

    ctx.helper.success(null, '更新成功');
  }

  public async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;

    const result = await ctx.model.User.deleteOne({ _id: id });

    if ((result as any).deletedCount === 0) {
      ctx.helper.error('删除失败', 400);
      return;
    }

    ctx.helper.success(null, '删除成功');
  }
}
