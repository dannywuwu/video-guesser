if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
    origins: ["http://localhost:3000"],
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
  addUserToUsers,
} = require("../build/users.js");
const {
  addUserToRoom,
  getRoomTurn,
  leaveRoom,
  getUsersInRoom,
} = require("../build/room.js");

var users: Users = {}; // user id -> user objects
var rooms: Rooms = {}; // room id -> room objects

// creates user and adds them to Users and Rooms
const createUser = (
  id: string,
  name: string,
  room: string,
  users: Users,
  rooms: Rooms
): User => {
  const newUser = userFactory(id, name, room);
  addUserToUsers(users, newUser, id);
  addUserToRoom(rooms, room, newUser);
  return newUser;
};

// io 'connection' wrapper
io.on("connection", (socket: any) => {
  // ID of the current user
  const uid = socket.id;
  let clientUser: User;

  // sets user on backend and sends it back to client in callback
  socket.on(
    "set-user",
    (
      id: string,
      name: string,
      room: string,
      callback: (user: User) => User
    ) => {
      if (id != uid) {
        throw "set-user id is not uid";
      }
      // create user object
      clientUser = userFactory(id, name, room)
      // add user to users{} dict
      addUserToUsers(users, clientUser, uid);
      console.log(uid + " has connected");
      callback(clientUser);
    }
  );

  // user joins room
  socket.on(
    "join-room",
    (name: string, room: string, callback: (users: Users) => Users) => {

      // subscribe user socket to room
      socket.join(room);
      console.log(`${name} has joined room: ${room}`);

      // updates user.name
      setName(users, name, uid);
      // updates rooms and user.room and emit it to all the users in that room
      addUserToRoom(rooms, room, clientUser);
      console.log("join-room", rooms)
      io.to(room).emit("display-users", getUsersInRoom(rooms, room));
      // send users in room back to client
      callback(getUsersInRoom(rooms, room));
    }
  );

  // send this statement to every other client, the user and if they're ready or not
  socket.on("ready-player", (isReady: boolean) => {
    // get room of current user
    const room = getRoom(users, uid);
    // current player is ready
    io.to(room).emit("get-ready-players", clientUser, isReady);
  });

  // choosing the chooser phase
  socket.on("choose-chooser", (roomID: number) => {
    console.log("choosing chooser for " + roomID);
    // increment the turn counter for this room
    const roomTurn = ++rooms[roomID].turn;
    const roomUsers = getUsersInRoom(rooms, roomID);
    // chooser ID from [1, # users in room]
    const newChooserID = roomUsers.find(
      (user: User) => user.position == roomTurn % roomUsers.length
    );
    console.log("new chooser is " + newChooserID);
    // update chooser for room
    const newChooser = getUser(users, newChooserID);
    rooms[roomID].chooser = newChooser;
    io.to(roomID).emit("chooser-chosen", newChooser);
  });

  // user leave room
  socket.on(
    "leave-room",
    (
      room: Room,
      user: User,
      callback: (f: (rooms: Rooms, room: string) => Users) => void
    ) => {
      console.log(uid + " has left room:  " + room);
      // mutate user and rooms[uid]
      leaveRoom(clientUser, rooms, uid);
      removeUser(users, uid);
      // logging message for testing
      callback(getUsersInRoom(rooms, room));
      // rerender user display
      io.to(room).emit("display-users", getUsersInRoom(rooms, room));
    }
  );

  // player leaves the game (why would they ever do this)
  socket.on("disconnect", () => {
    // remove user from users, then update client
    console.log(`${uid} has left`);
    // remove user from user and readyusers(if applicable) list
    if (clientUser) {
      const room = getRoom(users, uid);
      console.log("disconnect", clientUser, rooms) 
      leaveRoom(clientUser, rooms, uid);
      users = removeUser(users, uid);
      io.to(room).emit("display-users", getUsersInRoom(rooms, room));
    }
  });
});

// youtube api key
const API_KEY = process.env.API_KEY;

// helper to format Youtube API response
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

// GET endpoint to call Youtube API
app.get("/get/:search", (req, res) => {
  let search = req.params.search;
  const url = `https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=24&q=${search}`;
  fetch(url)
    .then((response: any) => response.json())
    .then((data: any) => {
      const { items } = data;
      const videoListData = { items: formatVideoListData(items) };
      res.header("Content-Type", "application/json");
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
