export {}; // fixes 'Cannot redeclare block-scoped variable 'fetch'.ts(2451)' warning
import express from "express";

const fetch = require("node-fetch");
const cors = require("cors");

// const express = require("express");
const app = express();
const http = require("http").createServer(app);
const morgan = require("morgan");
const io = require("socket.io")(http, {
  cors: {
    origin: "localhost:3000",
  },
});
app.use(cors());
app.use(morgan("tiny"));

// helpers
const {
  setName,
  setRoom,
  userFactory,
  removeUser,
  getUser,
  getRoom,
} = require("../build/users.js");
const {
  addUserToRoom,
  getRoomTurn,
  leaveRoom,
  getUsersInRoom,
} = require("../build/room.js");

var users: Users = {}; // user id -> user objects
var rooms: Rooms = {}; // room id -> room objects

io.on("connection", (socket: any) => {
  let user = userFactory(socket.id, "", "");
  users[socket.id] = user;
  console.log(socket.id + " has connected");
  socket.on(
    "join-room",
    (name: string, room: string, callback: (user: User) => User) => {
      socket.join(room);
      console.log(`${name} has joined room: ${room}`);
      setRoom(users, room, socket.id);
      setName(users, name, socket.id);
      //

      addUserToRoom(rooms, room, user);
      callback(user); // send the user to the client
      // send client users in their room
      console.log("getUsersInRoom ", getUsersInRoom(rooms, room));

      io.to(room).emit("display-users", getUsersInRoom(rooms, room));
    }
  );

  socket.on("ready-player", (isReady: boolean) => {
    let room = getRoom(users, socket.id);
    io.to(room).emit("get-ready-players", user, isReady);
    // send this statement to every other client, the user and if they're ready or not
  });

  socket.on("choose-chooser", (roomID: number) => {
    console.log("choosing chooser for " + roomID);
    // increment roomTurns[roomID]
    const roomTurn = ++rooms[roomID].turn;
    const roomUsers = getUsersInRoom(rooms, roomID);
    // chooser ID from % 12
    const newChooser = roomUsers.find(
      (user: User) => user.position == roomTurn % 12
    );
    console.log("new chooser is " + newChooser.id);
    // update users list
    users[newChooser.id].isChooser = true;
    io.to(roomID).emit("chooser-chosen", newChooser);
  });

  socket.on(
    "leave-room",
    (
      room: Room,
      callback: (f: (rooms: Rooms, room: string) => Users) => void
    ) => {
      console.log(socket.id + " has left " + room);
      leaveRoom(user, rooms, socket.id);
      // logging message for testing
      callback(getUsersInRoom(rooms, room));
      io.to(room).emit("display-users", getUsersInRoom(rooms, room));
    }
  );

  socket.on("disconnect", () => {
    // remove user from users, then update client
    console.log(`${socket.id} has left`);
    let room = getRoom(users, socket.id);
    // remove user from user and readyusers(if applicable) list
    leaveRoom(user, rooms, socket.id);
    users = removeUser(users, socket.id);
    io.to(room).emit("display-users", getUsersInRoom(rooms, room));
  });
});

// youtube api
const API_KEY = process.env.API_KEY;

const formatVideoListData = (data: any): Video => {
  return data.map((video: any) => {
    const {
      snippet: {
        title,
        channelTitle,
        thumbnails: {
          high: { url },
        },
      },
      id: { videoId },
    } = video;
    return { title, channelTitle, url, videoId };
  });
};

app.get("/get/:search", (req, res) => {
  console.log("HEREHEREHERE");
  let search = req.params.search;
  const url = `https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=24&q=${search}`;
  fetch(url)
    .then((response: any) => response.json())
    .then((data: any) => {
      const { items } = data;
      console.log(items);
      const videoListData = { items: formatVideoListData(items) };
      res.header("Content-Type", "application/json");
      // res.send(videoListData)
      //   res.send(data)
      res.send(JSON.stringify(videoListData, null, 4));
    });
});

app.get("/", (req, res) => {
  res.send("<h1>bts</h1>");
});

const port = 5000;
http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
