const Router = require("koa-router");
const qixiRouter = new Router();
const axios = require("axios");
const { get, set, del } = require("../../../utils/cacheData");
const response = require('../../../utils/response')

// 接口信息
const routerInfo = {
    name: "qixi",
    title: "七喜影视",
    subtitle: "影视",
};

// 缓存键名
const cacheKey = "qixiData";

// 调用路径
const host = "https://www.7xi.tv";

// 给图片地址加上host
function getCover(url) {
    if (url.indexOf("http") == -1) {
        return `${host}${url}`
    }
    return url
}

const cookieValue = 'HstCfa4680397=1690107050696; HstCmu4680397=1690107050696; zh_choose=n; __51cke__=; HstCnv4680397=38; HstCns4680397=72; PHPSESSID=mtknb6ddos54rr4l1prp6a3kde; user_id=18411; user_name=madou11; group_id=3; group_name=VIP%E4%BC%9A%E5%91%98; user_check=f9a6b8fa325d8646d139c69a71e4d7b2; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png; HstCla4680397=1692069064690; HstPn4680397=2; HstPt4680397=239; __tins__21465215=%7B%22sid%22%3A%201692069051369%2C%20%22vd%22%3A%203%2C%20%22expires%22%3A%201692070885361%7D; __51laig__=3'
const config = {
    headers: {
      Cookie: `${cookieValue}`
    }
  };

// 视频搜索
qixiRouter.get("/7xi/search", async (ctx) => {
    const { kw, page } = ctx.query;
    const res = await axios.get(`${host}/vodsearch/page/${page}/wd/${kw}.html`)
    if (res.status == 200){
        try {
            const ul = res.data.match(/<ul class="hl-one-list([\s\S]+?)<\/ul/)[1]
            const li = ul.match(/<li([\s\S]+?)<\/li>/g)
            const total = res.data.match(/<div class="hl-page-total">(.+?)<\/div>/)[1].split('/&nbsp;')[1].replace('页','')
            const bangumi = []
            li.forEach(e => {
                const title = e.match(/title="(.+?)"/)[1]
                const id = e.match(/href="(.+?)"/)[1]
                const poster = getCover(e.match(/data-original="(.+?)"/)[1])
                const update = e.match(/<span class="hl-lc-1 remarks">(.+?)<\/span>/)[1]
                const description = e.match(/class="hl-item-sub hl-text-muted hl-lc-2">(.+?)<\/p>/)[1]
                const tagss = e.match(/<em>(.+?)<\/p>/)[1]
                const tdata = tagss.replace('<em>', '').replace('</em>', '').split('&nbsp;·&nbsp;')
                const tags = [];
                tdata.forEach(item => {
                    if (item.includes('&nbsp;')) {
                        const parts = item.split('&nbsp;');
                        tags.push(...parts.filter(part => part.trim() !== '')); // 合并分割后的内容到数组
                    } else {
                        tags.push(item);
                    }
                });
                const releaseDate = tags[1]
                bangumi.push({
                    title,
                    id,
                    poster,
                    update,
                    description,
                    tags,
                    releaseDate
                })
            })
            response(ctx, 200, {data: bangumi, total: total}, routerInfo)
        }catch (err){
            response(ctx, 200, {data: [], total: 0}, routerInfo)
        }
    }

});

// 热门内容
qixiRouter.get("/7xi", async (ctx) => {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    const bangumi = data ? data : []
    if (!data) {
        // 如果缓存中不存在数据
        const res = await axios.get(`${host}/label/rankweek.html`)
        const ul = /class="hl-rank-list clearfix"([\s\S]+?)\/ul/g.exec(res.data)[0]
        const li = ul.match(/<li class="hl-list-item hl-col-xs-12">([\s\S]+?)<\/li>/g)
        li.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const id = e.match(/href="(.+?)"/)[1]
            const poster = getCover(e.match(/data-original="(.+?)"/)[1])
            const update = e.match(/<span class="hl-lc-1 remarks">(.+?)<\/span>/)[1]
            const description = e.match(/hl-lc-2">(.+?)<\/p>/)[1]
            const tagss = e.match(/<em>(.+?)<\/p>/)[1]
            const tdata = tagss.replace('<em>', '').replace('</em>', '').split('&nbsp;·&nbsp;')
            const tags = [];
            tdata.forEach(item => {
                if (item.includes('&nbsp;')) {
                    const parts = item.split('&nbsp;');
                    tags.push(...parts.filter(part => part.trim() !== '')); // 合并分割后的内容到数组
                } else {
                    tags.push(item);
                }
            });
            const releaseDate = tags[1]
            bangumi.push({
                title,
                id,
                poster,
                update,
                description,
                tags,
                releaseDate
            })
        })
        // 将数据写入缓存
        await set(cacheKey, bangumi);
    }
    response(ctx, 200, bangumi, routerInfo)
});

// 详情页
qixiRouter.get("/7xi/detail", async (ctx) => {
    const { url } = ctx.query;
    const res1 = await axios.get(`${host}${url}`)
    const res = res1.data
    let desc = '';
    try {
        desc = res.match(/name="description" content="(.+?)"/)[1]
    } catch (error) {
        response(ctx).error('', '此类数据有毒', '4004')
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
    ctx.body = response(ctx, data);
});

// 播放地址
qixiRouter.get("/7xi/watch", async (ctx) => {
    const { url } = ctx.query;
    const res = await axios.get(`${host}/vodplay/${url}`, config)
    try {
        const m3u8 = res.data.match(/"url":"http(.+?).m3u8"/);
        const watchUrlTitleStr = res.data.match(/hl-plays-from hl-tabs swiper-wrapper clearfix">([\s\S]+?)<\/div>/g)[0]
        const watchUrlTitle = watchUrlTitleStr.match(/alt="(.+?)"/g)
        const watchUrlGroupsStr = res.data.match(/id="hl-plays-list">([\s\S]+?)<\/ul/g)
        const episodes = []
        let i = 0
        watchUrlGroupsStr.forEach(e => {
            const episode = []
            let lis = e.match(/<li([\s\S]+?)<\/li>/g)
            lis.forEach(e => {
                const match = e.match(/<a href="(.+?)">(.+?)<\/a>/)
                episode.push({
                    url: match[1].replace('" class="hl-text-conch active', ''),
                    name: match[2].replace('<em class="hl-play-active hl-bg-conch"></em>', ''),
                })
            })
            const title = watchUrlTitle[i++].split(`"`)[1]
            episodes.push({
                title: title,
                urls: episode
            })
        })
        console.log(episodes)
        const data = {
            type: "hls",
            m3u8: `http${m3u8[1].replace(/\\\/|\/\\/g, "/")}.m3u8`,
            episodes
        }
        response(ctx, 200, data, '成功')
    } catch (err) {
        response(ctx, 606, '', '此类数据有毒，但是很好看！');
    }

});

qixiRouter.info = routerInfo;
module.exports = qixiRouter;
