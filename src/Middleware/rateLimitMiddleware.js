const rateLimit = require('koa-ratelimit');

// 创建不同的限流实例来为不同的接口设置不同的访问次数限制
const generalLimit = rateLimit({
    driver: 'memory',
    db: new Map(),
    duration: 60000,
    errorMessage: '请求过于频繁，请稍后再试。',
    max: 2,
});

const specialLimit = rateLimit({
    driver: 'memory',
    db: new Map(),
    duration: 60000,
    errorMessage: '请求过于频繁，请稍后再试。',
    max: 10, // 不同接口的最大请求数可以不同
});

module.exports = {
    generalLimit,
    specialLimit
}