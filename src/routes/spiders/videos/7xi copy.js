const Router = require("koa-router");
const mddmRouter = new Router();
const axios = require("axios");
const { get, set, del } = require("../../../utils/cacheData");
const response = require('../../../utils/response')

// 接口信息
const routerInfo = {
    name: "mddm",
    title: "曼岛动漫",
    subtitle: "动漫",
  };
  
// 缓存键名
const cacheKey = "mddmData";
    
// 调用路径
const host = "https://www.mandaoo.com";

// 给图片地址加上host
function getCover(url) {
    if (url.indexOf("http") == -1) {
        return `${host}${url}`
    }
    return url
}

// 视频搜索
mddmRouter.get("/mddm/search", async (ctx) => {
    const { kw, page } = ctx.query;
    const res = await axios.get(`${host}/search.php?page=${page}&searchword=${kw}&searchtype=`)
    const li = res.data.match(/<a class="li-hv"([\s\S]+?)<\/a>/g)
    const bangumi = []
    li.forEach(e => {
        const title = e.match(/title="(.+?)"/)[1]
        const url = e.match(/href="(.+?)"/)[1]
        const cover = e.match(/data-original="(.+?)"/)[1]
        const update = e.match(/<p class="bz">(.+?)<\/p>/)[1]
        bangumi.push({
            title,
            url,
            cover,
            update,
        })
    })
    response(ctx, bangumi, routerInfo)
});

// 热门内容
mddmRouter.get("/mddm", async (ctx) => {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    const bangumi = data ? data : []
    if (!data) {
        // 如果缓存中不存在数据
        const res = await axios.get(`${host}/list/lm2.html`)
        const li = res.data.match(/<a class="li-hv"([\s\S]+?)<\/a>/g)
        li.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/data-original="(.+?)"/)[1]
            const update = e.match(/<p class="bz">(.+?)<\/p>/)[1]
            bangumi.push({
                title,
                url,
                cover,
                update,
            })
        })
        // 将数据写入缓存
        await set(cacheKey, bangumi);
    }
    const Data = {
        bangumi:bangumi,
        routerInfo:routerInfo,
        from:from
    }
    response(ctx, 200, Data, '获取成功！')
});

// 详情页
mddmRouter.get("/mddm/detail", async (ctx) => {
    const { url } = ctx.query;
    const res1 = await axios.get(`${host}${url}`)
    const res = res1.data
    let desc = '';
    try {
        desc = res.match(/name="description" content="(.+?)"/)[1]
    }catch(error){
        response(ctx,4004,'','此类数据有毒')
        console.log('错误url地址')
        return;
    }
    const cover = getCover(res.match(/data-original="(.+?)"/)[1])
    const title = res.match(/hl-dc-title hl-data-menu">(.+?)</)[1]
    const watchUrlTitleStr = res.match(/hl-plays-from hl-tabs swiper-wrapper clearfix">([\s\S]+?)<\/div>/g)[0]
    const watchUrlTitle = watchUrlTitleStr.match(/alt="(.+?)"/g)
    const watchUrlGroupsStr = res.match(/id="hl-plays-list">([\s\S]+?)<\/ul/g)
    const episodes = []
    let i = 0
    watchUrlGroupsStr.forEach(e => {
        const episode = []
        let lis = e.match(/<li([\s\S]+?)<\/li>/g)
        lis.forEach(e => {
            const match = e.match(/<a href="(.+?)">(.+?)<\/a>/)
            episode.push({
                url: match[1],
                name: match[2],
            })
        })
        const title = watchUrlTitle[i++].split(`"`)[1]
        episodes.push({
            title: title,
            urls: episode
        })
    })
    const data = {
        episodes,
        desc,
        cover,
        title
    }
    ctx.body = response(ctx, 200, data, '获取成功！');
});

// 播放地址
mddmRouter.get("/mddm/watch", async (ctx) => {
    const { url } = ctx.query;
    const res = await axios.get(`${host}${url}`)
    const m3u8 = res.data.match(/"url":"http(.+?).m3u8"/)
    const data = {
        type: "hls",
        url: `http${m3u8[1].replace(/\\\/|\/\\/g, "/")}.m3u8`
    }
    response(ctx, 200, data, '获取成功！')
});

mddmRouter.info = routerInfo;
module.exports = mddmRouter;