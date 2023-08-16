const Router = require('koa-router');
const usersRouter = require('./usersRouter');
const authRouter = require('./authRouter');
const spiderRouter = require('./spiders');
const messageModel = require('../models/messageModel');
const articleRouter = require('../routes/articleRouter');
const fileRouetr = require('../routes/fileRouter');

const authenticateJWT = require('../utils/authenticateJWT');
const {specialLimit, generalLimit} = require("../Middleware/rateLimitMiddleware");
const axios = require("axios");
const response = require("../utils/response");

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'Hello, this is your API!';
});

router.get('/api/history', async (ctx) => {
  try {
    const historyData = await messageModel.history();
    ctx.body = historyData;
  } catch (error) {
    console.error('Error fetching history:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error fetching history' };
  }
});


// 用户管理相关路由
router.use('/api/users', authenticateJWT, usersRouter.routes(), usersRouter.allowedMethods());

// 用户认证相关路由
router.use('/api/auth', authRouter.routes(), authRouter.allowedMethods());

// 添加spider相关路由
router.use('/api/spider', authenticateJWT, specialLimit, spiderRouter.routes(), spiderRouter.allowedMethods());

// 添加文章相关路由
router.use('/api/article', articleRouter.routes(), articleRouter.allowedMethods());

// 添加上传文件路由
router.use('/api/upload',authenticateJWT, generalLimit , fileRouetr.routes(), fileRouetr.allowedMethods());

// 搜索
router.get('/api/search', async (ctx) => {
  const { kw = '每日笑话', pageSize = 10 } = ctx.request.query;
  console.log("kw => " + kw);
  try {
    // 使用 Axios 发起请求获取数据
    const resp = await axios.get(`https://vercel.bizhangjie.top/search?q=${kw}&max_results=${pageSize}`);
    const ListData = resp.data; // 假设返回的数据结构是数组，取第一个元素

    if (ListData) {
      response(ctx, 200, ListData, `获取${kw}成功!`);
    } else {
      response(ctx, 404, null, `未找到指定${kw}。`);
    }
  } catch (err) {
    response(ctx, 500, null, `获取${kw}过程中发生错误: ` + err);
  }
});

module.exports = router;
