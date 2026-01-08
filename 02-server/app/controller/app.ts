import { Controller } from 'egg';

export default class AppController extends Controller {
  public async list() {
    const { ctx } = this;
    const { page = 1, pageSize = 10, keyword } = ctx.query;

    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize;

    const query: any = {};
    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword as string, 'i') },
        { description: new RegExp(keyword as string, 'i') },
      ];
    }

    const list = await ctx.model.App.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .lean();

    const total = await ctx.model.App.countDocuments(query);

    ctx.helper.success({
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  public async create() {
    const { ctx } = this;
    const { name, description, repository, type } = ctx.request.body;

    ctx.validate({
      name: { type: 'string', required: true },
      description: { type: 'string', required: false },
      repository: { type: 'string', required: true },
      type: { type: 'string', required: true },
    });

    const app = await ctx.model.App.create({
      name,
      description,
      repository,
      type,
    });

    ctx.helper.success({ id: app._id }, '创建成功');
  }

  public async show() {
    const { ctx } = this;
    const { id } = ctx.params;

    const app = await ctx.model.App.findById(id).lean();

    if (!app) {
      ctx.helper.error('应用不存在', 404);
      return;
    }

    ctx.helper.success(app);
  }

  public async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name, description, repository, type } = ctx.request.body;

    const result = await ctx.model.App.updateOne(
      { _id: id },
      { name, description, repository, type }
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

    const result = await ctx.model.App.deleteOne({ _id: id });

    if ((result as any).deletedCount === 0) {
      ctx.helper.error('删除失败', 400);
      return;
    }

    ctx.helper.success(null, '删除成功');
  }
}
