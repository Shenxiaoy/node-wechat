const JwtUtil = require('../utils/jwt')
const connection = require('../sql')
// 登录校验的接口
const apiCheckList = ['/article/save']

// 判断token 是否过期
function loginRealness (token) {
  const jwt = new JwtUtil(token)
  const result = jwt.verifyToken()
  if (result === 'error') {
    return null
  }
  else {
    return result
  }
}

// 是否是管理员
function isManager (name) {
  const names = ['xiuxiu']
  if (names.includes(name)) {
    return true
  }
  else {
    return false
  }
}

// res.body 返回封装
class resBody {
  static success (obj, msg) {
    const init = {
      code: 0,
      msg: msg || '成功'
    }
    init.data = obj || {}
    return init
  }

  static error (obj, msg) {
    const init = {
      code: 1,
      msg: msg || '错误'
    }
    init.data = obj
    return init
  }
}
// sql查询promise
function sqlQuery (sql) {
  return new Promise((res, rej) => {
    connection.query(sql, function (err, content) {
      if (err) {
        rej(err)
      } else {
        res(content)
      }
    })
  })
}
// sql 插入promise
function sqlInert (sql, obj) {
  return new Promise((res, rej) => {
    connection.query(sql, obj, function (err, result, data) {
      if (err) {
        rej(err)
      } else {
        res(result)
      }
    })
  })
}

module.exports = {
  isManager,
  loginRealness,
  resBody,
  sqlQuery,
  sqlInert
}