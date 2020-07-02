const JwtUtil = require('../utils/jwt')

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
      errorMsg: msg || '错误'
    }
    init.data = obj
    return init
  }
}

module.exports = {
  isManager,
  loginRealness,
  resBody
}