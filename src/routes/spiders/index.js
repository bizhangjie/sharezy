const fs = require("fs");
const path = require("path");
const Router = require("koa-router");

const router = new Router();

// 全部路由数据
const allRouterInfo = {
  name: "全部接口",
  subtitle: "除了特殊接口外的全部接口列表",
  total: 0,
  data: [],
};

// 根目录
router.get("/", async (ctx) => {
  await ctx.render("index");
});

// 遍历所有路由模块
fs.readdirSync(__dirname)
  .filter((filename) => filename.endsWith(".js") && filename !== "index.js")
  .forEach((filename) => {
    const routerPath = path.join(__dirname, filename);
    const routerModule = require(routerPath); // 加载
    // 自动注册路由
    if (routerModule instanceof Router) {
      // 写入路由数据
      if (routerModule?.info) {
        allRouterInfo.total++;
        allRouterInfo.data.push({
          ...routerModule.info,
          stack: routerModule.stack,
        });
      }
      // 引用路由
      router.use(routerModule.routes());
    }
  });


// 全部接口路由
router.get("/all", async (ctx) => {
  console.log("获取全部接口路由");
  if (allRouterInfo.total > 0) {
    ctx.body = {
      code: 200,
      message: "获取成功",
      ...allRouterInfo,
    };
  } else if (allRouterInfo.total === 0) {
    ctx.body = {
      code: 200,
      message: "暂无接口，请添加",
      ...allRouterInfo,
    };
  } else {
    ctx.body = {
      code: 500,
      message: "获取失败",
      ...allRouterInfo,
    };
  }
});

// 全部路由数据
const alljmRouterInfo = {
  name: "全部视频接口",
  subtitle: "除了特殊接口外的全部视频接口列表",
  total: 0,
  data: [],
};
// 当前文件下的子文件夹下的所有路由模块
fs.readdirSync(__dirname)
  .filter((filename) => fs.statSync(path.join(__dirname, filename)).isDirectory())
  .forEach((subdir) => {
    const subdirPath = path.join(__dirname, subdir);
    fs.readdirSync(subdirPath)
      .filter((filename) => filename.endsWith(".js") && filename !== 'index.js')
      .forEach((filename) => {
        const subpath = path.join(subdirPath, filename);
        const routerModule = require(subpath);
        // 自动注册路由
        if (routerModule instanceof Router) {
          // 写入路由数据
          if (routerModule?.info) {
            alljmRouterInfo.total++;
            alljmRouterInfo.data.push({
              ...routerModule.info,
              stack: routerModule.stack,
            });
          }
          // 父URL路径为文件名
          const parentURL = `/${subdir}`; // 例如：如果子目录名为 "users"，则父URL路径为 "/users"
          // 引用路由，并设置父URL路径
          router.use(parentURL, routerModule.routes());
        }
      });
  });

// 全部接口路由
router.get("/vall", async (ctx) => {
  console.log("获取全部接口路由");
  if (alljmRouterInfo.total > 0) {
    ctx.body = {
      code: 200,
      message: "获取成功",
      ...alljmRouterInfo,
    };
  } else if (alljmRouterInfo.total === 0) {
    ctx.body = {
      code: 200,
      message: "暂无接口，请添加",
      ...alljmRouterInfo,
    };
  } else {
    ctx.body = {
      code: 500,
      message: "获取失败",
      ...alljmRouterInfo,
    };
  }
});

module.exports = router;