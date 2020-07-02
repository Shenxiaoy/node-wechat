const db = require('../db')
var onlineNum = []

function ioSend (ctx) {
  const { socket } = ctx

  /*
  *
  *
  * **/
  // socket.on('message', data => {
	// socket.broadcast.emit('message', data)
  // })

  socket.on('joinRoom', async data => {
    // 在线登记
	// db.Outline.create(data)
	// 加入房间
	socket.join(data.room)
	// 返回近50条消息
	const info = await getMsg(data.room)
	/*// 筛选所有用户
	db.Msg.find({}).distinct('name').exec(function (error, data) {
	})*/

	// 在线人数
	const a = await db.Outline.find({room: data.room})
	if(!a.length) {
	  await db.Outline.create(data)
	} else {
	  const isExist = a.find(item => {
	    return item.username === data.username
	  })

	  if (!isExist) {
		await db.Outline.create(data)
	  }
	}
	const b = await db.Outline.find({room: data.room})

	socket.emit('joinRoom', {
	  initMsgs: info,
	  onlineUsers: b.length
	})
  })

  socket.on('leaveRoom', data => {
	socket.leave(data.roomName)
  })

  /*
  * 接受客户端的信息
  * **/
  socket.on('sendMsg', async data => {
    console.log(data, 'send----------')
    const date = new Date
	data.time = date
    db.Msg.create(data)
	const a = await db.Outline.find({room: data.room})
	data.onlineUsers = a.length
	socket.emit('onlineUsers', {onlineUsers: a.length})
	socket.broadcast.to(data.room).emit('receiveMsg', data)
  })

  socket.on('leaveChat', data => {
	const id = data.id

	if(onlineNum.indexOf(id) !== -1) {
	  const index = onlineNum.indexOf(id)
	  onlineNum.splice(index, 1)
	  socket.broadcast.emit('onlineHeight', {mans: onlineNum.length})
	  socket.emit('onlineHeight', {mans: onlineNum.length})
	}

  })


  socket.on('disconnect', async data => {
    const cookies = decodeURIComponent(socket.request.headers.cookie)
	const username = getCookie(cookies, 'username')
	if(username) {
	  await db.Outline.deleteOne({username: username})
	}

  })
}

// 返回倒叙50条msg消息
async function getMsg (room) {
  let list = []
  await db.Msg.find({room: room}, null, {limit: 50, sort: {'_id': -1}}, function (error, data) {
    list = data ? data.reverse() :[]
  })
  return list
}

async function onlineUsers () {
  let list = []
  await db.Outline.find({}, function (err, data) {
    list = data
  })
}
function getCookie (cookies, key) {
  const strCookie = cookies

  if (strCookie.indexOf(key) > -1) {
	const arrCookie = strCookie.split("; ")
	for (let i = 0; i < arrCookie.length; i++) {
	  const arr = arrCookie[i].split("=")

	  if (arr[0] === key) {
		return arr[1]
	  }
	}
  } else {
	return null
  }
}

module.exports = ioSend