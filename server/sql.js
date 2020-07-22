const mysql = require('mysql')
let connection = mysql.createConnection({
  host: '139.199.98.207',
  user: 'root',
  password: 'shenxiaoyu',
  port: '5666',
  charset: 'utf8',
  database: 'shenxiaoyu'
})
connection.connect((err, result) => {
  if (err) {
    console.log('mysql连接失败')
  } else {
    console.log('mysql连接成功')
  }
})
// const sql = 'SELECT * FROM goods'
// connection.query(sql, function (err, result) {
//   if (err) {
//     console.log(err, 'hh')
//   } else {
//     console.log(result, 'bb')
//   }
// })

module.exports = connection
// connection.end()