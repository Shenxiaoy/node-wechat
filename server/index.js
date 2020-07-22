const koa = require('koa')
const path = require('path')
const router = require('koa-router')()
const cors = require('koa2-cors')
const serve = require('koa-static')
const koaBody = require('koa-body')
const app = new koa()
const configData = require('./routes/configData')
const sqls = require('./sql')

// 路由集合
const commonRouter = require('./routes/common')
const goodsRouter = require('./routes/goods')

// app.use(serve(__dirname + '/static'))
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 2* 1024 * 1024,
    multipart: true
  }
}))

// cors 跨域
app.use(cors({
  origin: function (ctx) {
    return ctx.header.origin
  },
  credentials: true,  // 配合客户端axios withCredentials=true 允许服务端可以往客户端写入cookie
}))

// 登录信息获取
app.use(async (ctx, next) => {
  const token = ctx.cookies.get('token')
  if (!token) {
    ctx.username = ''
  }
  else {
    const result = configData.loginRealness(token)

    if (!result) {
      ctx.username = ''
    } else {
      // const userInfo = await db.users.findOne({_id: result})
      // ctx.username = userInfo ? userInfo.username : ''
    }

  }
  await next()
})

// test
router.get('/1', async (ctx, next) => {
  ctx.redirect('https://www.baidu.com')
  ctx.response.body = 'test'

})

router.use('/common', commonRouter.routes(), commonRouter.allowedMethods())
router.use('/goods', goodsRouter.routes(), goodsRouter.allowedMethods())
app.use(router.routes())

app.listen(9101, function () {
  console.log('post:' + 9101)
})