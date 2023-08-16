require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./src/routes');
const session = require('koa-session');
const cors = require('koa2-cors');
const loggerMiddleware = require('./src/Middleware/loggerMiddleware');
const { koaBody } = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');

const app = new Koa();

// 使用会话密钥
app.keys = [process.env.Session];

// 使用 Session 中间件
app.use(session(app));

// 使用 koa-bodyparser 中间件
app.use(bodyParser());

// 添加 CORS 中间件
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// 使用日志中间件
app.use(loggerMiddleware());

// 添加路由
app.use(router.routes());
app.use(router.allowedMethods());

// 添加文件上传
// 使用 koa-body 中间件处理文件上传
app.use(
    koaBody({
        formidable: {
            uploadDir: __dirname + '/uploads', // 设置文件上传目录
            keepExtensions: true, // 保留文件扩展名
        },
        multipart: true, // 支持文件上传
        urlencoded: true, // 解析 URL 编码的请求体
    })
);

// 添加静态文件服务，将/uploads作为前缀
// 将 /uploads 映射到静态文件目录
app.use(koaStatic(path.join(__dirname, 'uploads')));



// 星际聊天
const WebSocket = require('koa-websocket');
const wsApp = WebSocket(app); // Wrap Koa app with WebSocket
const authenticateWsJWT = require('./src/utils/authenticateWsJWT');
wsApp.ws.use(authenticateWsJWT);
// 创建 WebSocket 服务器
const websocketMiddleware = require('./src/Middleware/websocketMiddleware')
wsApp.ws.use(websocketMiddleware);


// 启动 HTTP 服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});