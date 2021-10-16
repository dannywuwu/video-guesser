const fetch = require('node-fetch')
const cors = require('cors')

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const morgan = require('morgan')
const io = require("socket.io")(http, {
  cors: {
    origin: "*"
  }
});
app.use(cors())
app.use(morgan('tiny'))

// helpers
const { setName, setRoom, userFactory, removeUser, getUser, getRoom } = require('./users.js')
const { addUserToRoom, getRoomTurn, leaveRoom, getUsersInRoom } = require('./room.js')

//middleware
// app.use(morgan('tiny'))

let users = {} // dict of users
let rooms = {} // room: user objects
let roomTurns = {} // dict mapping room id -> turns

io.on("connection", socket => {
  let user = userFactory(socket.id, "", "")
  users[socket.id] = user
  console.log(socket.id + ' has connected')
  socket.on("join-room", (name, room, callback) => {
    socket.join(room)
    console.log(`${name} has joined room: ${room}`)
    setRoom(users, room, socket.id)
    setName(users, name, socket.id)
    //
    
    addUserToRoom(rooms, room, user)
    callback(user) // send the user to the client
    // send client users in their room
    console.log("getUsersInRoom ", getUsersInRoom(rooms, room))

    io.to(room).emit("display-users", getUsersInRoom(rooms, room))
  })


  socket.on("ready-player", (isReady) => {
      let room = getRoom(users, socket.id)
      io.to(room).emit("get-ready-players", user, isReady)
      // send this statement to every other client, the user and if they're ready or not
  })

  socket.on("choose-chooser", (roomID) => {
      console.log("choosing chooser for " + roomID);
      // increment roomTurns[roomID]
      const roomTurn = roomTurns[++roomID];
      const roomUsers = getUsersInRoom(rooms, roomID);
      // chooser ID from % 12
      const newChooser = roomUsers.find(user => user.order == roomturn % 12);
      console.log('new chooser is ' + newChooser.id)
      // update users list
      users[newChooser.id].isChooser = true;
      io.to(roomID).emit("chooser-chosen", newChooser);
  })

  socket.on("leave-room", (room, callback) => {
    console.log(socket.id + " has left " + room)
    leaveRoom(user, rooms, socket.id)
    callback(getUsersInRoom(rooms, room))
    io.to(room).emit("display-users", getUsersInRoom(rooms, room))

  })

  socket.on("disconnect", () => {
    // remove user from users, then update client
    console.log(`${socket.id} has left`)
    let room = getRoom(users, socket.id)
    // remove user from user and readyusers(if applicable) list
    leaveRoom(user, rooms, socket.id)
    users = removeUser(users, socket.id)
    io.to(room).emit("display-users", getUsersInRoom(rooms, room))
  })

})


// youtube api
const API_KEY = process.env.API_KEY

const formatVideoListData = (data) => {
  return data.map((video) => {
    const { snippet: { title, channelTitle, thumbnails: { high: { url } } }, id: { videoId } } = video;
    return { title, channelTitle, url, videoId };
  })
}

app.get('/get/:search', (req, res) => {
  console.log("HEREHEREHERE")
  let search = req.params.search
  url = `https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=24&q=${search}`
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { items } = data;
      console.log(items);
      videoListData = { items: formatVideoListData(items) };
      res.header("Content-Type", 'application/json');
      // res.send(videoListData)
    //   res.send(data)
      res.send(JSON.stringify(videoListData, null, 4));
    })
})

app.get('/', (req, res) => {
  res.send('<h1>bts</h1>')
})


const port = 5000
http.listen(port, () => {
  console.log(`listening on port ${port}`)
})