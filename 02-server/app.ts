import { Application } from 'egg';

export default class AppBootHook {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async didLoad() {
    // 应用加载完成
  }

  async willReady() {
    // 应用即将启动，初始化数据库
    await this.initDatabase();
  }

  async didReady() {
    // 应用已启动
    console.log('应用启动成功');
  }

  async serverDidReady() {
    // 服务器已准备好
  }

  async beforeClose() {
    // 应用关闭前
  }

  private async initDatabase() {
    const { app } = this;
    
    try {
      // 确保索引创建
      await app.model.User.createIndexes();
      await app.model.App.createIndexes();
      await app.model.Iteration.createIndexes();
      await app.model.Permission.createIndexes();

      console.log('MongoDB 索引创建成功');

      // 检查是否存在管理员账号
      const adminExists = await app.model.User.findOne({ username: 'admin' });
      
      if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await app.model.User.create({
          username: 'admin',
          password: hashedPassword,
          nickname: '管理员',
          email: 'admin@example.com',
        });
        
        console.log('默认管理员账号创建成功 (用户名: admin, 密码: admin123)');
      }
    } catch (error) {
      console.error('数据库初始化失败:', error);
    }
  }
}
