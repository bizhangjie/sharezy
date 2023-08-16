const jwt = require('jsonwebtoken');
const response = require("./response");

// 保护路由的中间件
async function authenticateWsJWT(ctx, next) {
  // 获取 WebSocket 实例
  const ws = ctx.websocket;
  // 获取从客户端传递的 token
  const token = ctx.query.token;// 你需要根据实际情况获取 token 的方式
  console.log('验证token => ' + token);

  try {
    const secretKey = process.env.JWT_SECRET_KEY; // 从环境变量获取 JWT 密钥
    if (!secretKey) {
      throw new Error('JWT secret key is not defined in environment variables.');
    }
    // 验证 token
    const decoded = jwt.verify(token, secretKey);
    ctx.user = decoded; // 将用户信息存储在上下文中
    console.log("验证通过")
    // 如果验证通过，继续处理连接
    await next();
  } catch (error) {
    console.log("验证失败")
    ws.close(1008, 'Unauthorized: Invalid token'); // 关闭连接并发送未授权状态码
  }
}

module.exports = authenticateWsJWT;
