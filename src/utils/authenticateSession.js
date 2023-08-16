const response = require("./response");

// 受保护的路由
async function authenticateSession(ctx, next) {
  if (!ctx.session) {
    response(ctx, 500, '', '会话对象未正确设置。')
  }

  const userRole = ctx.session.user ? ctx.session.user.role : null;

  // 检查用户是否登录
  if (!userRole) {
    response(ctx, 401, '', '未登录, 请先登录！')
  } else {
    // 这里可以根据用户角色进行权限控制
    // 例如，如果用户是管理员，允许访问受保护的路由
    if (userRole === 'admin') {
      await next();
    } else {
      response(ctx, 403, '', '没有访问权限。')
    }
  }


}

// 其他路由和中间件定义...

module.exports = authenticateSession;
