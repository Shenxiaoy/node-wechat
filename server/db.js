const mongoose = require('mongoose')
const Schema = mongoose.Schema
const articleModel = require('./db/articles-model')
mongoose.connect('mongodb://139.199.98.207:27017/article', {
  useNewUrlParser:true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', function (error) {
  console.log(error, 'db 连接失败')
})
db.on('open', function (db1) {
  console.log('db 连接成功！')
})

/*const doc1 = new Blog({
  name: 'test',
  msg: 'this is test'
})
doc1.save()*/

// Blog.create({name:'sas', msg: 'kkksdsdskkk'})

// Blog.find({}, null, {limit: 1}, function(err, docs) {
//   console.log(docs, '000')
// })


module.exports = {
  articleModel: articleModel.articleList,
  users: articleModel.users
}


