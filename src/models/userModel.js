const pool = require('../utils/db')

// 获取所有用户（排除已删除的用户）
async function getAllUsers() {
  const [rows] = await pool.query('SELECT * FROM users WHERE is_deleted = 0');
  return rows;
}

// 添加 uid 到 user_details 表
async function addUidToUserDetails(uid) {
  const defaultData = {
    avatar_url: 'default_avatar_url',
    fullname: 'Unknown',
    email: 'unknown@example.com',
    phone: '000-000-0000',
    gender: 'female',
    age: 18,
    hobbies: 'No hobbies',
    occupation: 'Unemployed',
    bio: 'This is a new user',
    permission: 0
  };

  const sql = `INSERT INTO user_details (uid, avatar_url, fullname, email, phone, gender, age, hobbies, occupation, bio, permission)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    uid,
    defaultData.avatar_url,
    defaultData.fullname,
    defaultData.email,
    defaultData.phone,
    defaultData.gender,
    defaultData.age,
    defaultData.hobbies,
    defaultData.occupation,
    defaultData.bio,
    defaultData.permission
  ];

  const [rows] = await pool.query(sql, values);
  return rows;

}

// 修改个人信息
async function updateUser(uid, newData) {
  // 更新用户信息
  const updateQuery = `
  UPDATE user_details
  SET avatar_url = ?, fullname = ?, email = ?, phone = ?,
      gender = ?, age = ?, hobbies = ?, occupation = ?, bio = ?
  WHERE uid = ?;
`;

  const updateValues = [
    newData.avatarUrl,
    newData.fullname,
    newData.email,
    newData.phone,
    newData.gender,
    newData.age,
    newData.hobbies.join(', '), // 将 hobbies 数组转换为逗号分隔的字符串
    newData.occupation,
    newData.bio,
    uid,
  ];
  const [rows] =await pool.query(updateQuery, updateValues)
  return rows[0];
}

// 根据uid获取用户信息
async function getOneUserByUid(uid) {
  const getQuery = `SELECT user_details.id, users.username, user_details.avatar_url, user_details.uid, user_details.fullname, user_details.email, user_details.phone, user_details.gender, user_details.age, user_details.hobbies, user_details.occupation, user_details.bio, user_details.permission
  FROM user_details
  JOIN users ON user_details.uid = users.uid
  WHERE user_details.uid = ?;`;
  const [rows] = await pool.query(getQuery, [uid]);
  return rows[0];
}

// 创建新用户
async function createUser(uid, username, password) {
  await pool.query('INSERT INTO users (uid, username, password) VALUES (?, ?, ?)', [uid, username, password]);
}

// 获取单个用户信息
async function getUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND is_deleted = 0', [id]);
  return rows[0];
}

// 根据uid获取用户信息
async function getUserByUid(uid) {
  const [rows] = await pool.query('SELECT * FROM users WHERE uid = ? AND is_deleted = 0', [uid]);
  return rows[0];
}

// 根据username获取用户信息
async function getUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND is_deleted = 0', [username]);
  return rows[0];
}

// 删除用户（软删除）
async function deleteUserById(id) {
  await pool.query('UPDATE users SET is_deleted = 1 WHERE id = ?', [id]);
}

// 导出相关函数
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByUid,
  getUserByUsername,
  deleteUserById,
  // 添加其他用户管理相关函数
  updateUser, // 修改个人信息
  getOneUserByUid, // 获取个人信息
  addUidToUserDetails, // 注册成功填入uid
  
};
