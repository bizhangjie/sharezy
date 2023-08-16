// articleModel.js
const pool = require('../utils/db')

// 创建文章
async function createArticle(title, content, username, tags, categories, cover_image, description) {
    const publishTime = new Date(); // 使用当前时间
    const sql = `INSERT INTO articles (title, content, username, tags, categories, publish_time, cover_image, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [title, content, username, JSON.stringify(tags), JSON.stringify(categories), publishTime, cover_image, description];

    try {
        const [rows] = await pool.query(sql, values);
        return rows.insertId; // 返回插入的文章ID
    } catch (err) {
        throw err;
    }
}

// 获取用户最近发布文章的时间
async function getLastPublishTimeByUsername(username) {
    try {
        const query = `
      SELECT publish_time
      FROM articles
      WHERE username = ? AND publish_time IS NOT NULL
      ORDER BY publish_time DESC
      LIMIT 1
    `;
        const [rows] = await pool.query(query, [username]);
        return rows;
    } catch (err) {
        throw err;
    }
}

// 根据id查看文章
async function getArticleById(articleId) {
    const sql = `SELECT * FROM articles WHERE id = ?`;
    const [rows] = await pool.query(sql, [articleId]);
    return rows[0]; // 返回查询结果的第一行，即文章数据
}

// 分页查询文章列表
async function getArticleList(page, pageSize) {
    const offset = (page - 1) * pageSize;
    const sql = `
      SELECT id, title, username, tags, categories, SUBSTRING(content, 1, 100) AS contentPreview, publish_time, view_count, like_count, cover_image, description
      FROM articles
      WHERE IsDelete = 0
      ORDER BY publish_time DESC
      LIMIT ?, ?
    `;
    const values = [offset, pageSize];

    try {
        const [rows] = await pool.query(sql, values);
        return rows; // 返回查询到的文章列表数据
    } catch (err) {
        throw err;
    }
}

// 获取文章总数
async function getTotalArticleCount(){
    const countSql = `
      SELECT COUNT(*) AS total
      FROM articles
      WHERE IsDelete = 0
    `;
    const [countResult] = await pool.query(countSql);
    const total = countResult[0]?.total || 0;
    return total;
}

// 其他可能的模型函数...


module.exports = {
    createArticle,  // 创建文章
    getLastPublishTimeByUsername, // 获取用户最近发布文章的时间
    getArticleById, // 根据ID查看文章
    getArticleList, // 分页查询文章列表
    getTotalArticleCount, // 获取文章总数
};
