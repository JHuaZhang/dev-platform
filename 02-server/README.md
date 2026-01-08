# 发布平台后端服务

基于 Egg.js + TypeScript + MySQL 的后端服务

## 技术栈

- **框架**: Egg.js 3.x
- **语言**: TypeScript
- **数据库**: MySQL
- **缓存**: Redis
- **认证**: JWT

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置数据库

修改 `config/config.default.ts` 中的数据库配置

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:7001

### 构建生产版本

```bash
npm run tsc
npm start
```

## 项目结构

```
02-server/
├── app/
│   ├── controller/     # 控制器
│   ├── service/        # 服务层
│   ├── middleware/     # 中间件
│   ├── model/          # 数据模型
│   └── router.ts       # 路由配置
├── config/             # 配置文件
├── typings/            # 类型定义
└── test/               # 测试文件
```

## API 文档

### 认证相关
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册

### 应用管理
- GET /api/apps - 获取应用列表
- POST /api/apps - 创建应用
- GET /api/apps/:id - 获取应用详情
- PUT /api/apps/:id - 更新应用
- DELETE /api/apps/:id - 删除应用

### 迭代管理
- GET /api/iterations - 获取迭代列表
- POST /api/iterations - 创建迭代
- GET /api/iterations/:id - 获取迭代详情

## 环境变量

创建 `.env` 文件配置环境变量：

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=publish_platform

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_jwt_secret
```
