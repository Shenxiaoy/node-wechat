const Router  = require('koa-router')
const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')
const router = new Router()
const configData = require('./configData')
const resBody = configData.resBody

const accessKey = '9h5kHWHnr20ObcQ45Efmw7Y2J8Dn_0lvl6ch0cTZ'
const secretKey = '_Dro3CR3xabMhgBloJy0F7Q_Xy50xnW7aYDTPP7H'
const bucket = 'coooo)'

// qiniu 云上传token
router.get('/token', async (ctx, next) => {
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  let options = {
   scope: bucket,
   expires: 3600 * 24
  }
  let putPolicy =  new qiniu.rs.PutPolicy(options)
  let uploadToken= putPolicy.uploadToken(mac)
  if (uploadToken) {
    ctx.body = resBody.success({token: uploadToken}, 'success')
  } else {
    ctx.body = resBody.error(null, 'qiniu token error')
  }
})

// 上传处理
router.post('/upload', async (ctx, next) => {
  const file = ctx.request.files.file
  const fileReader = fs.createReadStream(file.path)
  const filePath = path.join(__dirname, '..', '/static/upload/')
  console.log(filePath, '-0000')
  const fileResource = filePath + `/${file.name}`
  const writeStream = fs.createWriteStream(fileResource)
  const uploadUrl = 'image.shenxiaoyu.cn'

  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        fileReader.pipe(writeStream);
        ctx.body = {
          url: uploadUrl + `/${file.name}`,
          code: 0,
          message: '上传成功'
        };
      }
    });
  } else {
    fileReader.pipe(writeStream);
    ctx.body = {
      url: uploadUrl + `/${file.name}`,
      code: 0,
      message: '上传成功'
    };
  }

})

module.exports = router