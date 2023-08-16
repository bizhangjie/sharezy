// loggerMiddleware.js
module.exports = function loggerMiddleware() {
    return async (ctx, next) => {
        const start = Date.now();

        await next();

        const ms = Date.now() - start;
        const ip = ctx.headers['x-forwarded-for'] || ctx.socket.remoteAddress;
        // const userAgent = ctx.headers['user-agent'];
        const userAgent = '';
        const method = ctx.method;
        const host = ctx.headers.host;
        const path = ctx.url;

        const now = new Date();
        const formattedDate = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

        console.log(`${formattedDate} - ${method} ${host}${path} - ${ms}ms - IP: ${ip} - User Agent: ${userAgent}`);
    };
};
