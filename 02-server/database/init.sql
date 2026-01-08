-- 创建数据库
CREATE DATABASE IF NOT EXISTS publish_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE publish_platform;

-- 用户表
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

-- 应用表
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

-- 迭代表
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

-- 权限表
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

-- 插入测试数据
INSERT INTO `users` (`username`, `password`, `nickname`, `email`, `created_at`, `updated_at`) VALUES
('admin', '$2a$10$YourHashedPasswordHere', '管理员', 'admin@example.com', NOW(), NOW());
