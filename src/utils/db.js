const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// 使用 dotenv 加载 .env 文件
dotenv.config();

// 读取数据库连接信息
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
