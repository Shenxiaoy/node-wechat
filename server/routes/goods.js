// 商品
const Router  = require('koa-router')
const connection = require('../sql')
const router = new Router()
const configData = require('./configData')
const resBody = configData.resBody
const {sqlQuery, sqlInert} = configData

router.get('/list', async (ctx, next) => {
  const request = ctx.request.query
  let pageNum, pageSize
  pageNum = request.pageNum || 1
  pageSize = request.pageSize || 10
  let queryList = []
  const queryParams = ['name', 'skuCode']
  queryParams.forEach(item => {
    if (request[item]) {
      if (item === 'skuCode') {
        queryList.push(`${item}=${request[item]}`)
        return
      }
      queryList.push(`${item}='${request[item]}'`)
    }
  })
  queryList = queryList.length ? `where ${queryList.join(' and ')}` : ''
  // 倒叙、分页查询
  const sqlList = ['SELECT * FROM goods', queryList, 'order by id desc', `limit ${(pageNum - 1) * pageSize},${pageNum * pageSize -1}`]
  const sql = sqlList.join(' ')
  const result = await sqlQuery(sql)
  const count = await sqlQuery('SELECT count(id) FROM goods')
  console.log(count, 'count---')
  ctx.response.body = resBody.success({
    list: result,
    totalCount: count
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