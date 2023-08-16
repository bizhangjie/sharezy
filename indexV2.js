require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./src/routes');
const session = require('koa-session');
const cors = require('koa2-cors');
const loggerMiddleware = require('./src/Middleware/loggerMiddleware');
const WebSocketApi = require('./src/utils/ws');
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

// // 创建 HTTP 服务器
// const http = require('http');
// const server = http.createServer(app.callback());
//
// const WebSocket = require('ws'); // 引入 ws 模块
// // 创建 WebSocket 服务器
// const wss = new WebSocket.Server({
//     server
// });
//
// // 启动 WebSocketApi
// WebSocketApi(wss);

// // 启动 HTTP 服务器
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
const WebSocket = require('koa-websocket');
const messageModel = require("./src/models/messageModel");
const wsApp = WebSocket(app); // Wrap Koa app with WebSocket
const authenticateWsJWT = require('./src/utils/authenticateWsJWT');
wsApp.ws.use(authenticateWsJWT);


// 保存 WebSocket 连接的集合
const connections = new Set();

// 创建 WebSocket 服务器
wsApp.ws.use(async (ctx, next) => {
    // 添加新连接到集合
    connections.add(ctx.websocket);
    // 监听消息
    ctx.websocket.on('message', (message) => {
        console.log(`接收来自用户《${ctx.user.userUid}》的消息 => ${message}`);
        // 处理消息，这里可以根据需要进行处理
        // 广播消息给所有连接的客户端
        for (const connection of connections) {
            // connection.readyState的几种状态 WebSocket.CONNECTING (0): 正在连接 WebSocket.OPEN (1): 已连接 WebSocket.CLOSING (2): 正在关闭 WebSocket.CLOSED (3): 已关闭
            if (connection !== ctx.websocket && connection.readyState === 1){
                console.log("开发广播给所有用户 》》》.")
                console.log(`消息 =》 ${message}`)
                connection.send(message);
            }
        }
    });

    // 监听关闭事件
    ctx.websocket.on('close', () => {
        // 从集合中移除连接
        connections.delete(ctx.websocket);
    });

    await next();
});
// 启动 HTTP 服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});