import { Controller } from 'egg';

export default class IterationController extends Controller {
  public async list() {
    const { ctx } = this;
    const { page = 1, pageSize = 10, appId } = ctx.query;

    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize;

    const query: any = {};
    if (appId) {
      query.appId = appId;
    }

    const list = await ctx.model.Iteration.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .lean();

    const total = await ctx.model.Iteration.countDocuments(query);

    ctx.helper.success({
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  public async create() {
    const { ctx } = this;
    const { appId, version, branch, commitId, description } = ctx.request.body;

    ctx.validate({
      appId: { type: 'string', required: true },
      version: { type: 'string', required: true },
      branch: { type: 'string', required: true },
      commitId: { type: 'string', required: true },
    });

    const iteration = await ctx.model.Iteration.create({
      appId,
      version,
      branch,
      commitId,
      description,
      status: 'pending',
    });

    ctx.helper.success({ id: iteration._id }, '创建成功');
  }

  public async show() {
    const { ctx } = this;
    const { id } = ctx.params;

    const iteration = await ctx.model.Iteration.findById(id).lean();

    if (!iteration) {
      ctx.helper.error('迭代不存在', 404);
      return;
    }

    ctx.helper.success(iteration);
  }
}
