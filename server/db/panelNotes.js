const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 便签面板信息list
const notesSchema = new Schema({
  title: String,
  content: String,
  time: Date,
  username: String
})

const panelNotes = mongoose.model('panelnotes', notesSchema)


module.exports = {
  panelNotes
}