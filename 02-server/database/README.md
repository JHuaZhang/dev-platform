# 数据库SQL语句文档

## 数据库初始化

### 创建数据库
```sql
CREATE DATABASE IF NOT EXISTS publish_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE publish_platform;
```

## 数据表结构

### 1. 用户表 (users)
```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 2. 应用表 (apps)
```sql
CREATE TABLE IF NOT EXISTS `apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '应用名称',
  `description` text COMMENT '应用描述',
  `repository` varchar(255) NOT NULL COMMENT '代码仓库地址',
  `type` varchar(50) NOT NULL COMMENT '应用类型',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用表';
```

### 3. 迭代表 (iterations)
```sql
CREATE TABLE IF NOT EXISTS `iterations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '应用ID',
  `version` varchar(50) NOT NULL COMMENT '版本号',
  `branch` varchar(100) NOT NULL COMMENT '分支名',
  `commit_id` varchar(100) NOT NULL COMMENT '提交ID',
  `description` text COMMENT '迭代描述',
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT '状态: pending/building/success/failed',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='迭代表';
```

### 4. 权限表 (permissions)
```sql
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `app_id` int(11) NOT NULL COMMENT '应用ID',
  `role` varchar(20) NOT NULL COMMENT '角色: owner/developer/viewer',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_app` (`user_id`, `app_id`),
  KEY `user_id` (`user_id`),
  KEY `app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';
```

## 初始化数据

### 插入默认管理员账号
```sql
INSERT INTO `users` (`username`, `password`, `nickname`, `email`, `created_at`, `updated_at`) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere', '管理员', 'admin@example.com', NOW(), NOW());
```

## 常用查询语句

### 用户相关

#### 查询所有用户
```sql
SELECT id, username, nickname, email, created_at 
FROM users 
ORDER BY created_at DESC;
```

#### 根据关键词搜索用户
```sql
SELECT id, username, nickname, email, created_at 
FROM users 
WHERE username LIKE '%keyword%' OR nickname LIKE '%keyword%'
ORDER BY created_at DESC;
```

#### 创建新用户
```sql
INSERT INTO users (username, password, nickname, email, created_at, updated_at)
VALUES ('username', 'hashed_password', 'nickname', 'email@example.com', NOW(), NOW());
```

#### 更新用户信息
```sql
UPDATE users 
SET nickname = 'new_nickname', email = 'new_email@example.com', updated_at = NOW()
WHERE id = 1;
```

#### 删除用户
```sql
DELETE FROM users WHERE id = 1;
```

### 应用相关

#### 查询所有应用
```sql
SELECT * FROM apps ORDER BY created_at DESC;
```

#### 根据关键词搜索应用
```sql
SELECT * FROM apps 
WHERE name LIKE '%keyword%' OR description LIKE '%keyword%'
ORDER BY created_at DESC;
```

#### 创建新应用
```sql
INSERT INTO apps (name, description, repository, type, created_at, updated_at)
VALUES ('app_name', 'app_description', 'git_repository_url', 'app_type', NOW(), NOW());
```

#### 更新应用信息
```sql
UPDATE apps 
SET name = 'new_name', description = 'new_description', repository = 'new_repo', type = 'new_type', updated_at = NOW()
WHERE id = 1;
```

#### 删除应用
```sql
DELETE FROM apps WHERE id = 1;
```

### 迭代相关

#### 查询应用的所有迭代
```sql
SELECT * FROM iterations 
WHERE app_id = 1 
ORDER BY created_at DESC;
```

#### 创建新迭代
```sql
INSERT INTO iterations (app_id, version, branch, commit_id, description, status, created_at, updated_at)
VALUES (1, 'v1.0.0', 'main', 'commit_hash', 'iteration_description', 'pending', NOW(), NOW());
```

#### 更新迭代状态
```sql
UPDATE iterations 
SET status = 'success', updated_at = NOW()
WHERE id = 1;
```

### 权限相关

#### 查询用户的所有权限
```sql
SELECT p.*, u.username, u.nickname, a.name as app_name
FROM permissions p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN apps a ON p.app_id = a.id
WHERE p.user_id = 1;
```

#### 查询应用的所有权限
```sql
SELECT p.*, u.username, u.nickname, a.name as app_name
FROM permissions p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN apps a ON p.app_id = a.id
WHERE p.app_id = 1;
```

#### 授予权限
```sql
INSERT INTO permissions (user_id, app_id, role, created_at)
VALUES (1, 1, 'developer', NOW());
```

#### 撤销权限
```sql
DELETE FROM permissions WHERE id = 1;
```

## 数据库维护

### 查看表结构
```sql
DESC users;
DESC apps;
DESC iterations;
DESC permissions;
```

### 查看表索引
```sql
SHOW INDEX FROM users;
SHOW INDEX FROM apps;
SHOW INDEX FROM iterations;
SHOW INDEX FROM permissions;
```

### 统计数据量
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as user_count,
  (SELECT COUNT(*) FROM apps) as app_count,
  (SELECT COUNT(*) FROM iterations) as iteration_count,
  (SELECT COUNT(*) FROM permissions) as permission_count;
```

## 注意事项

1. 密码字段使用 bcrypt 加密存储，不要直接存储明文密码
2. 所有时间字段使用 datetime 类型，创建和更新时使用 NOW() 函数
3. 删除数据前请确认是否有关联数据，避免数据不一致
4. 定期备份数据库，防止数据丢失
5. 生产环境请修改默认管理员密码
