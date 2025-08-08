const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");

const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});

// 简单的计数器API（内存存储）
let counter = 0;

/**
 * 更新计数器
 * @param {Object} ctx - Koa上下文对象
 */
router.post("/api/count", async (ctx) => {
  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    counter++;
  } else if (action === "clear") {
    counter = 0;
  }

  ctx.body = {
    code: 0,
    data: counter,
  };
});

/**
 * 获取当前计数
 * @param {Object} ctx - Koa上下文对象
 */
router.get("/api/count", async (ctx) => {
  ctx.body = {
    code: 0,
    data: counter,
  };
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});

const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 80;

/**
 * 启动服务器
 */
function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
