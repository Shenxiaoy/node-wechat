const mysql = require('mysql')
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shenxiaoyu',
  port: '5666',
  charset: 'utf8'
})
connection.connect((err, result) => {
  if (err) {
    console.log(err);
    console.log('连接失败')
  } else {
    console.log(result)
    console.log('连接成功')
  }
})
connection.end()