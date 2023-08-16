const pool = require('../utils/db')

// 将消息保存到数据库
async function saveMessageToDatabase(messageData) {
    const { sender, content, timestamp, avatar, color, username } = messageData;
    const sql = `INSERT INTO chat_messages (sender, content, timestamp, avatar, color, username) VALUES (?, ?, ?, ?, ?, ?)`;
    const [rows] = await pool.query(sql, [sender, content, timestamp, avatar, color, username]);
    return rows;
}

// 获取历史消息
async function history(){
    // 查询数据库以获取历史消息
    const sql = 'SELECT * FROM chat_messages ORDER BY timestamp ASC';
    const [rows] = await pool.query(sql);
    return rows;
}


module.exports = {
    saveMessageToDatabase, // 将消息保存到数据库
    history,
}