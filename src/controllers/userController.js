const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const response = require('../utils/response');
const jwt = require('jsonwebtoken');


// 生成验证码
const svgCaptcha = require('svg-captcha');

// 用户登录
async function loginUser(ctx) {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    response(ctx, 400, null, '用户名和密码是必填字段!');
    return;
  }

  try {
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      response(ctx, 404, null, '用户不存在!');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      response(ctx, 401, null, '无效的密码!');
      return;
    }

    const user2 = await userModel.getOneUserByUid(user.uid);
    // 提取所需数据
    const userData = {
      username: user2.username,
      avatar_url: user2.avatar_url,
    };

    // 生成并返回用户令牌
    const token = generateUserToken(user2);
    response(ctx, 200, { token, user: userData }, '登录成功！')
    return;
  } catch (err) {
    response(ctx, 500, null, '登录过程中发生错误!' + err);
  }
}

function generateUserToken(user) {
  // 从环境变量获取 JWT 密钥
  const secretKey = process.env.JWT_SECRET_KEY; // 从环境变量中获取密钥
  if (!secretKey) {
    throw new Error('JWT secret key is not defined in environment variables.');
  }

  const expiresIn = '48h'; // 设置令牌有效期，可以根据需求调整

  const token = jwt.sign({ userUid: user.uid, userName: user.username, gender: user.gender, avatar_url: user.avatar_url }, secretKey, { expiresIn });

  return token;
}

// 注册用户
async function registerUser(ctx) {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    response(ctx, 400, null, '用户名和密码是必填字段!');
    return;
  }

  try {
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) {
      response(ctx, 409, null, '相同用户名的用户已存在!');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const uid = uuid.v4();  //随机生成唯一标识
      await userModel.createUser(uid, username, hashedPassword);
      // 添加 uid 到 user_details 表
      await userModel.addUidToUserDetails(uid);

      response(ctx, 201, null, '用户注册成功!');
    }
  } catch (err) {
    response(ctx, 500, null, '注册过程中发生错误!' + err);
  }
}

// 更新用户个人信息
async function updateUser(ctx) {
  const userData = ctx.request.body;
  try {
    const uid = ctx.state.user.userUid;
    const user = await userModel.getOneUserByUid(uid);
    if (user) {
      const updated = await userModel.updateUser(uid, userData);
      if (!updated) {
        response(ctx, 200, null, '用户信息已保存' + uid);
      } else {
        response(ctx, 404, null, '找不到用户' + uid);
      }
    } else {
      response(ctx, 404, null, '找不到用户' + uid);
    }
  } catch (err) {
    response(ctx, 500, null, '保存过程中发生错误!' + err);
  }
}

// 获取用户个人信息
async function getOneUser(ctx) {
  try {
    const uid = ctx.state.user.userUid;
    const user = await userModel.getOneUserByUid(uid);
    if (user) {
      if (user.uid) {
        response(ctx, 200, user, '获取成功');
      } else {
        response(ctx, 404, null, '找不到用户');
      }
    } else {
      response(ctx, 404, null, '找不到用户' + uid);
    }
  } catch (err) {
    response(ctx, 500, null, '保存过程中发生错误!' + err);
  }
}



// 退出登录接口
async function logoutUser(ctx) {
  try {
    // 在使用 JWT 的情况下，不需要清除会话信息
    // 直接响应成功信息即可

    response(ctx, 200, null, '退出登录成功!');
  } catch (err) {
    response(ctx, 500, null, '退出登录过程中发生错误!');
  }
}

// 根据 uid 或 username 查询用户
async function searchUsers(ctx) {
  const { uid, username } = ctx.query;
  try {
    let users;
    if (uid) {
      users = await userModel.getUserByUid(uid);
    } else if (username) {
      users = await userModel.getUserByUsername(username);
    } else {
      response(ctx, 400, null, 'uid 或 username 参数是必需的!');
      return;
    }

    if (!users) {
      response(ctx, 404, null, '用户未找到!');
    } else {
      response(ctx, 200, null, users);
    }
  } catch (err) {
    response(ctx, 500, null, '查询用户过程中发生错误!');
  }
}

// 获取所有用户
async function getUsers(ctx) {
  try {
    const users = await userModel.getAllUsers();
    response(ctx, 200, null, users);
  } catch (err) {
    response(ctx, 500, null, '获取用户数据时发生错误!');
  }
}

// 创建用户
async function createUser(ctx) {
  const { username, password } = ctx.query;

  if (!username || !password) {
    response(ctx, 400, null, '用户名和密码是必填字段!');
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(username, hashedPassword);
    response(ctx, 201, null, '用户创建成功!');
  } catch (err) {
    response(ctx, 500, null, '创建用户时发生错误!');
  }
}

// 获取单个用户信息
async function getUserById(ctx) {
  const { id } = ctx.params;

  try {
    const user = await userModel.getUserById(id);
    if (user) {
      response(ctx, 200, null, user);
    } else {
      response(ctx, 404, null, '未找到用户!');
    }
  } catch (err) {
    response(ctx, 500, null, '获取用户数据时发生错误!');
  }
}

// 获取单个用户信息（根据uid）
async function getUserByUid(ctx) {
  const { uid } = ctx.params;
  try {
    const user = await userModel.getUserByUid(uid);
    if (user) {
      response(ctx, 200, null, user);
    } else {
      response(ctx, 404, null, '未找到用户!');
    }
  } catch (err) {
    response(ctx, 500, null, '获取用户数据时发生错误!');
  }
}

// 获取单个用户信息（根据username）
async function getUserByUsername(ctx) {
  const { username } = ctx.params;
  try {
    const user = await userModel.getUserByUsername(username);
    if (user) {
      response(ctx, 200, null, user);
    } else {
      response(ctx, 404, null, '未找到用户!');
    }
  } catch (err) {
    response(ctx, 500, null, '获取用户数据时发生错误!');
  }
}

// 删除用户（软删除）
async function deleteUser(ctx) {
  const { id } = ctx.params;

  try {
    const user = await userModel.getUserById(id);
    if (user) {
      await userModel.deleteUserById(id);
      response(ctx, 200, null, '用户删除成功!');
    } else {
      response(ctx, 404, null, '未找到用户!');
    }
  } catch (err) {
    response(ctx, 500, null, '删除用户时发生错误!');
  }
}

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  searchUsers,
  getUsers,
  createUser,
  getUserById,
  getUserByUid,
  getUserByUsername,
  deleteUser,
  // 修改个人信息
  updateUser,
  // 获取个人信息
  getOneUser,
};
