// 商品
const Router  = require('koa-router')
const connection = require('../sql')
const router = new Router()
const configData = require('./configData')
const resBody = configData.resBody
// const sqlQuery = configData.sqlQuery
const {sqlQuery, sqlInert} = configData

router.get('/list', async (ctx, next) => {
  const sql = 'SELECT * FROM goods order by id desc'
  const result = await sqlQuery(sql)
    ctx.response.body = resBody.success({
      list: result
    })
})
/**
 * 添加商品
*/
router.post('/superMarket/save', async (ctx, next) => {
  const allKeyInit = {}
  Object.keys((await sqlQuery('SELECT * FROM goods WHERE id=1'))[0]).forEach(k=> allKeyInit[k] = null)
  delete allKeyInit.id

  // 判断skuCode递增值是否存在，不存在递增再查询，直到唯一值
  const baseCount = 13000000
  const sql = 'SELECT * FROM goods'
  const result = await sqlQuery(sql)
  let skuCode = baseCount + result.length + 1
  const sqlSkuCode = `SELECT name FROM goods where skuCode =${skuCode}`
  let isExist = await sqlQuery(sqlSkuCode)
  while (isExist.length) {
    skuCode = skuCode + 1
    isExist = await sqlQuery(`SELECT name FROM goods where skuCode =${skuCode}`)
  }
  
  const request = ctx.request.body
  const isRepeat = await sqlQuery(`SELECT id FROM goods where name='${request.name}'`)
  console.log(isRepeat, 'test')
  if (isRepeat.length) {
    ctx.body = resBody.error(null, '商品名称重复！')
    return
  }

  let params = {
    skuCode: skuCode,
    name: request.name,
    descri: request.descri,
    img_url: request.url,
    total_count: parseInt(request.count) || 0
  }
  const insertResult = await sqlInert('INSERT INTO goods SET ?', params)
  ctx.body = resBody.success({data: {}})
})

router.post('/superMarket/del', async (ctx, next) => {
  const request = ctx.request.body
  const sql = `DELETE FROM goods where skuCode=${request.skuCode}`
  const result = await sqlQuery(sql)
  ctx.body = resBody.success(null, 'delete success!')
})

router.post('/superMarket/update', async (ctx, next) => {
  const request = ctx.request.body
  console.log(request, 'ggg')
  const sql = `UPDATE goods SET name='${request.name}', descri='${request.descri}', img_url='${request.url}', total_count=${parseInt(request.count)} where skuCode=${request.skuCode}`
  const result = await sqlQuery(sql)
  ctx.body = resBody.success(null, '更新成功！')

})

module.exports = router