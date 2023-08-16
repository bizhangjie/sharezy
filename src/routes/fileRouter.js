// 这是你的文件上传处理路由
const Router = require('koa-router');
const router = Router();

router.post('/', async (ctx) => {
    try {
        const file = ctx.request.files.image; // 获取上传的文件对象

        // 获取上传后的文件路径或URL
        const uploadedFileName = file.newFilename;
        console.log(uploadedFileName)
        // 构建完整的文件 URL
        const fileUrl = `http://${ctx.request.host}/${uploadedFileName}`;

        // 进行文件处理，保存到数据库或其他操作

        // 返回文件 URL 给客户端
        ctx.body = { success: true, message: 'File uploaded successfully', url: fileUrl };
    } catch (error) {
        console.error('Error uploading file:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Error uploading file', error: error.message };
    }
});

module.exports = router;
