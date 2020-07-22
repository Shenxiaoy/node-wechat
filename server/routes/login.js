const Router  = require('koa-router')
const router = new Router()
const db = require('../db')
const jwtUtil = require('../utils/jwt')
const configData = require('./configData')

const resBody = configData.resBody

// 登录
router.post('/login', async (ctx, next) => {
  ctx.request.body.date = new Date()
  const {username, pass} = ctx.request.body
  if (username && pass) {
    const result = await db.users.findOne({username: username})
    if (result) {
      if (result.pass === pass) {
        const _id = result._id.toString()
        const jwt = new jwtUtil(_id)
        const token = jwt.generateToken()
        ctx.cookies.set('token', token)
        ctx.cookies.set('username', username)
        ctx.response.body = {
          code: 0,
          msg: '成功'
        }
      }
      else {
        ctx.response.body = {
          code: 1,
          errorMsg: '密码错误'
        }
      }
    }
    else {
      ctx.body = resBody.error(null, '此用户名不存在')
    }
  } else {
    ctx.response.body = {
      code: 1,
      errorMsg: '请输入用户名和密码'
    }
  }

})

// 注册
router.post('/signUp', async (ctx, next) => {
  ctx.request.body.date = new Date()
  const {username, pass, referee} = ctx.request.body

  if (username && pass) {
    // 推荐人校验
    if (referee !== 'sxy') {
      ctx.body = resBody.error(null, '推荐人不对')
      return
    }
    // 用户名是否注册
    const result = await db.users.findOne({username: username})
    if (result) {
      ctx.body = resBody.error(null, '该用户已存在')
      return
    }

    await db.users.create(ctx.request.body)
    ctx.body = resBody.success()
  } else {
    ctx.response.body = {
      code: 1,
      errorMsg: '请输入用户名和密码'
    }
  }

})

// 是否是登录态
router.get('/selfCheck', async (ctx, next) => {
  const token = ctx.cookies.get('token')
  // const origin = ctx.req.headers.origin
  // const loginUrl = origin + '/#/login'
  if (!token) {
    ctx.body = resBody.error()
  }
  else {
    const result = configData.loginRealness(token)
    const userInfo = await db.users.findOne({_id: result})
    if (result && userInfo) {
      const data = {
        username: userInfo.username
      }
      ctx.cookies.set('username', userInfo.username)
      ctx.body = resBody.success(data, '成功是是是')
    }
    else {
      ctx.body = resBody.error()
    }
  }

})

// 权限控制
router.get('/authority', async ctx => {
  // 随后把token校验获取username 放到中间件中存入
  const token = ctx.cookies.get('token')
  if (!token) {
    ctx.body = resBody.error(null, '未登录')
  }
  else {
    const result = configData.loginRealness(token)
    if (result) {
      const userInfo = await db.users.findOne({_id: result})
      if (userInfo.username === 'xiuxiu') {
        ctx.body = resBody.success({
          code: []
        })
      }
      else {
        ctx.body = resBody.success({
          code: ['delete']
        })
      }
    } else {
      ctx.body = resBody.error()

    }
  }

})


module.exports = router