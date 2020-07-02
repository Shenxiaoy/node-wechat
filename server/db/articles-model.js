const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 文章列表
const notesSchema = new Schema({
  title: String,
  content: String,
  auth: String,
  date: Date,
  username: String,
  userId: Number,
  name: String,
  firstImg: String,
  articleId: Number,
  fileList: Array,
  type: Number
})
const articleList = mongoose.model('articleList', notesSchema)

// 用户列表
const userSchema = new Schema({
  name: String,
  date: Date,
  pass: String,
  username: String
})
const users = mongoose.model('users', userSchema)

module.exports = {
  articleList,
  users
}