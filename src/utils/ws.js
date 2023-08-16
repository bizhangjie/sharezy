const messageModel = require('../models/messageModel');
const WebSocket = require('ws'); // 引入 ws 模块

// 监听 WebSocket 连接
module.exports = (wss) => wss.on('connection', (ws) => {
    console.log('Client connected');

    // 设置允许跨域连接的头信息
    // ws.on('headers', (headers) => {
    //     headers.push('Access-Control-Allow-Origin: *');
    //     headers.push('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    // });

    // 监听消息
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // 广播消息给所有连接的客户端
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        // 保存消息到数据库
        const messageData = JSON.parse(message);
        messageModel.saveMessageToDatabase(messageData);
    });

    // 监听关闭事件
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
