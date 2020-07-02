const koa = require('koa')
const path = require('path')
const router = require('koa-router')()
const cors = require('koa2-cors')
const serve = require('koa-static')
const koaBody = require('koa-body')
const app = new koa()

app.use(serve(__dirname + '/static'))
app.use(koaBody())
app.use(cors({
  origin: function (ctx) {
	return ctx.header.origin
  }
}))

router.post('/message', async (ctx, next) => {
  const queryData = ctx.request.body
  ctx.response.body = {code: 1, meg: queryData}

})
router.get('/1', async (ctx, next) => {
  ctx.response.body = 'shenxiaoyu'
})

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(9201, function () {
  console.log('post:' + 9201)
})