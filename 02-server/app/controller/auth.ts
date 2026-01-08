import { Controller } from 'egg';
import * as bcrypt from 'bcryptjs';

export default class AuthController extends Controller {
  public async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });

    const user = await ctx.model.User.findOne({ username }).lean();

    if (!user) {
      ctx.helper.error('用户不存在', 404);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      ctx.helper.error('密码错误', 401);
      return;
    }

    const token = app.jwt.sign(
      { id: user._id, username: user.username },
      app.config.jwt.secret,
      { expiresIn: '7d' }
    );

    ctx.helper.success({
      token,
      user: {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
      },
    });
  }

  public async register() {
    const { ctx } = this;
    const { username, password, nickname, email } = ctx.request.body;

    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true, min: 6 },
      nickname: { type: 'string', required: true },
      email: { type: 'email', required: true },
    });

    const existUser = await ctx.model.User.findOne({ username });
    if (existUser) {
      ctx.helper.error('用户名已存在', 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await ctx.model.User.create({
      username,
      password: hashedPassword,
      nickname,
      email,
    });

    ctx.helper.success({ id: user._id }, '注册成功');
  }
}
