const articleModel = require("../models/articleModel");
const response = require("../utils/response");

// 保存文章的函数
async function saveArticle(ctx) {
    const { title, content, username, tags, categories, cover_image, description } = ctx.request.body;

    if (!title || !content || !username || !tags || !categories) {
        response(ctx, 400, null, '必填字段不能为空!');
        return;
    }
    try {
        // 查询用户的最近发布时间
        const lastPublishTimeResult = await articleModel.getLastPublishTimeByUsername(username);
        const lastPublishTime = lastPublishTimeResult[0]?.publish_time; // 获取最近发布时间

        // 检查用户是否在规定时间内发布过文章
        const currentTime = Date.now();
        const timeLimit = 1 * 60 * 1000; // 5分钟的时间限制

        if (lastPublishTime) {
            const timeDifference = currentTime - new Date(lastPublishTime).getTime();
            if (timeDifference < timeLimit) {
                const remainingTime = Math.ceil((timeLimit - timeDifference) / 1000);
                response(ctx, 430, null, `您在${ Math.ceil(timeDifference / 1000)}秒内已发布过文章，请在${remainingTime}秒后再试。`);
                return;
            }
        }

        // 创建文章并保存发布时间
        const articleId = await articleModel.createArticle(title, content, username, tags, categories, cover_image, description);

        response(ctx, 201, null, '文章保存成功!', { articleId });
    } catch (err) {
        response(ctx, 500, null, '保存文章过程中发生错误: ' + err);
    }
}



// 根据ID查看文章
async function getArticleById(ctx) {
    console.log("测试")
    const id = ctx.params.id; // 从路由参数中获取文章ID
    console.log("id => " + id)
    try {
        // 调用 getArticleById 函数来获取文章数据
        const article = await articleModel.getArticleById(id);

        if (article) {
            response(ctx, 200, article, '获取文章成功!');
        } else {
            response(ctx, 404, null, '未找到指定文章。');
        }
    } catch (err) {
        response(ctx, 500, null, '获取文章过程中发生错误: ' + err);
    }
}

// 分页查询文章列表
async function getArticleList(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query;

    try {
        // 调用 getArticleList 函数来获取文章列表数据
        const articles = await articleModel.getArticleList(page, pageSize);
        const total = await articleModel.getTotalArticleCount();

        if (articles) {
            response(ctx, 200, {data: articles , total: total}, '获取文章列表成功!');
        } else {
            response(ctx, 404, null, '未找到文章列表。');
        }
    } catch (err) {
        response(ctx, 500, null, '获取文章列表过程中发生错误: ' + err);
    }
}

module.exports = {
    saveArticle, // 保存文章
    getArticleById, // 根据id查看文章
    getArticleList, // 分页查询文章列表

}