// 商品
const Router  = require('koa-router')
const connection = require('../sql')
const router = new Router()
const configData = require('./configData')
const resBody = configData.resBody

router.get('/list', async (ctx, next) => {
  const sql = 'SELECT * FROM goods'
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err, 'hh')
    } else {
      console.log(result, 'bb')
    }
  })
    ctx.response.body = resBody.success({
      name: 'xxx'
    })
})


// router.post('/save', async (ctx, next) => {
//   const queryData = ctx.request.body
//   queryData.date = new Date()
//   queryData.username = ctx.cookies.get('username')
//   if (queryData.type === 1) {
//     const obj = {
//       title: queryData.title,
//       fileList: queryData.content,
//       type: queryData.type,
//       content: '',
//       date: queryData.date,
//       username: queryData.username
//     }
//     await db.articleModel.create(obj)
//     ctx.response.body = {
//       code: 0,
//       success: '发表成功'
//     }

//   }
//   else if (queryData.type === 2) {
//     if (queryData.content) {
//       db.articleModel.create(queryData)
//       ctx.response.body = {
//         code: 0,
//         success: '发表成功'
//       }
//     } else {
//       ctx.response.body = {
//         code: 1,
//         errorMsg: '无内容'
//       }
//     }
//   }

// })
// router.post('/delete', async (ctx, next) => {
//   const queryData = ctx.request.body
//   await db.articleModel.deleteOne({_id: queryData.id})
//   ctx.body = resBody.success()

// })




module.exports = router