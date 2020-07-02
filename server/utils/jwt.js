const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cert = 'shenxiaoyu-ds'

class Jwt {
  constructor (data) {
    this.data = data
  }

  // 生成token
  generateToken () {
    const data = this.data
    const created = Math.floor(Date.now() / 1000)
    const token = jwt.sign(
      {
        data: data,
        exp: created + 60 * 60 * 24
      }, cert
    )
    return token
  }

  // 校验token
  verifyToken () {
    const token = this.data
    let res
    try {
      // 使用 RS256 加密更安全，需产出公钥私钥 密码解密 利用aes
      // const result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {}
      const result = jwt.verify(token, cert) || {}
      const {exp = 0} = result
      const current = Math.floor(Date.now() / 1000)
      if (current < exp) {
        res = result.data || {}
      }
    }
    catch (e) {
      res = 'error'
    }
    return res
  }
}

module.exports = Jwt