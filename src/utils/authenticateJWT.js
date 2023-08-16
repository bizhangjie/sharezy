const jwt = require('jsonwebtoken');
const response = require("./response");

// 保护路由的中间件
async function authenticateJWT(ctx, next) {
  const token = ctx.request.headers.authorization?.split(' ')[1];

  if (!token) {
    response(ctx, 401, '', '未登录, 请先登录！')
    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY; // 从环境变量获取 JWT 密钥
    if (!secretKey) {
      throw new Error('JWT secret key is not defined in environment variables.');
    }

    const decoded = jwt.verify(token, secretKey);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    response(ctx, 403, '', '没有访问权限。')
  }
}

module.exports = authenticateJWT;
