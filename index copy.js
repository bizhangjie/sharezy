require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./src/routes');
const session = require('koa-session');
const cors = require('koa2-cors'); // 导入 koa2-cors 包

const app = new Koa();

// 设置会话密钥
app.keys = [process.env.Session];
// 使用 Session 中间件
app.use(session(app));

// 使用 koa-bodyparser 中间件
app.use(bodyParser());

// 添加 CORS 中间件
app.use(
  cors({
    origin: '*', // 允许任何来源的请求
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的 HTTP 请求方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头部
    credentials: true, // 允许携带 Cookie 和凭证
  })
);

app.use(router.routes());
app.use(router.allowedMethods());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
