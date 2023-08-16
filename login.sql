// 创建用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(36) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_deleted TINYINT(1) DEFAULT 0
);


/******************************************/
/*   DatabaseName = sharezy   */
/*   TableName = user_details   */
/******************************************/
CREATE TABLE `user_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(36) NOT NULL COMMENT '用户唯一标识',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `fullname` varchar(255) DEFAULT NULL COMMENT '姓名',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `gender` enum('male','female') DEFAULT NULL COMMENT '性别',
  `age` int DEFAULT NULL COMMENT '年龄',
  `hobbies` varchar(255) DEFAULT NULL COMMENT '爱好',
  `occupation` varchar(255) DEFAULT NULL COMMENT '职业',
  `bio` text COMMENT '个人简介',
  `permission` tinyint DEFAULT NULL COMMENT '用户权限 (0: 普通用户, 1: 管理员)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  CONSTRAINT `user_details_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3
;
