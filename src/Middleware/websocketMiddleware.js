const connections = new Set(); // 用于存储连接的集合

// 维护在线人数的变量 （版本升级，使用用户列表获取用户人数）
// let onlineCount = 0;

// 存储用户信息的对象
const userMap = new Map(); // Key: 用户唯一标识，Value: 用户姓名

module.exports = async (ctx, next) => {
    // 获取用户唯一标识（假设在 ctx.user.userUid 中）
    const userUid = ctx.user.userUid;
    const userName = ctx.user.userName;
    const gender = ctx.user.gender;
    console.log("userUid => " + userUid + "  userName => " + userName + "  gender => " + gender);
    // 添加新连接到集合
    connections.add(ctx.websocket);

    // 增加在线人数
    // onlineCount++;

    // 将用户信息存储到 userMap
    userMap.set(userUid, { userName, gender });

    // 广播在线人数给所有连接的客户端
    broadcastOnlineCount();

    // 监听消息
    ctx.websocket.on('message', (message) => {
        console.log(`接收来自用户《${ctx.user.userUid}》的消息 => ${message}`);
        // 处理消息，这里可以根据需要进行处理
        // 广播消息给所有连接的客户端
        for (const connection of connections) {
            if (connection !== ctx.websocket && connection.readyState === 1){
                connection.send(message);
            }
        }
    });

    // 监听关闭事件
    ctx.websocket.on('close', () => {
        // 从集合中移除连接
        connections.delete(ctx.websocket);

        // 减少在线人数
        // onlineCount--

        // 删除用户信息
        userMap.delete(userUid);

        // 广播更新后的在线人数给所有连接的客户端
        broadcastOnlineCount();
    });

    await next();
};

// 广播在线人数给所有连接的客户端
function broadcastOnlineCount() {
    // const onlineCountMessage = JSON.stringify({ type: 'online_count', count: onlineCount })
    const onlineUsersMessage = JSON.stringify({ type: 'online_users', users: Array.from(userMap.values()) });
    for (const connection of connections) {
        if (connection.readyState === 1) {
            // connection.send(onlineCountMessage);
            connection.send(onlineUsersMessage);
        }
    }
}
