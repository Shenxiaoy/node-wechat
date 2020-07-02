const koa = require('koa')
const path = require('path')
const router = require('koa-router')()
const cors = require('koa2-cors')
const serve = require('koa-static')
const ioSend = require('./routes/io-send')
const db = require('./db')
const koaBody = require('koa-body')
const app = new koa()
const configData = require('./routes/configData')

// 路由集合
const articles = require('./routes/articles')

app.use(serve(__dirname + '/static'))
app.use(koaBody())

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
      const userInfo = await db.users.findOne({_id: result})
      ctx.username = userInfo ? userInfo.username : ''
    }

  }
  await next()
})

// test
router.get('/1', async (ctx, next) => {
  ctx.redirect('https://www.baidu.com')
  ctx.response.body = 'test'

})

// router.post('/notepanel/main/message', async (ctx, next) => {
//   const queryData = ctx.request.body
//   // db.panelNotes.create({title: '我的便签', content: 'test', username: 'sxy'})
//   // updateOne 不能够创建数据
//   await db.panelNotes.updateOne({title: queryData.title}, {content: queryData.str})
//   ctx.response.body = {code: 1, meg: 'success'}
//
// })
// router.get('/notepanel/main/message', async (ctx, next) => {
//   await db.panelNotes.find({title: '我的便签'}, function (err, data) {
// 	ctx.response.body = {code: 1, str: data[0].content}
//   })
//
// })
router.use('/article', articles.routes(), articles.allowedMethods())
app.use(router.routes())

app.listen(9101, function () {
  console.log('post:' + 9101)
})