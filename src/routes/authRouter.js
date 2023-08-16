const Router = require('koa-router');
const userController = require('../controllers/userController');

const authenticateJWT = require('../utils/authenticateJWT');

// 生成验证码
const svgCaptcha = require('svg-captcha');

const router = new Router();

// 用户注册
router.post('/register', userController.registerUser);

// 用户登录
router.post('/login', userController.loginUser);

// 用户退出登录
router.get('/logout', authenticateJWT, userController.logoutUser);

// 生成验证码路由
router.get('/captcha', async (ctx) => {
    // 清除之前的验证码
    ctx.session.captcha = undefined;

    const captcha = svgCaptcha.create({ size: 4, ignoreChars: '0o1i', noise: 10 });
    ctx.session.captcha = captcha.text; // 将验证码存储在会话中
    ctx.type = 'svg+xml'; // 设置响应的内容类型为 'svg'
    ctx.body = captcha.data; // 直接将验证码数据作为响应
});

module.exports = router;
