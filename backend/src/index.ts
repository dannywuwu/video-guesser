if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export {}; // fixes 'Cannot redeclare block-scoped let iable 'fetch'.ts(2451)' warning
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
  deleteRoom,
  leaveRoomBig,
} = require("../build/room.js");

let users: Users = {}; // user id -> user objects
let rooms: Rooms = {}; // room id -> room objects

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
      clientUser = userFactory(id, name, room);
      // add user to users{} dict
      addUserToUsers(users, clientUser, uid);
      console.log(uid + " has connected");
      callback(clientUser);
    }
  );

  // user joins room
  socket.on(
    "join-room",
    (name: string, rName: string, callback: (users: Users) => Users) => {
      // subscribe user socket to room
      socket.join(rName);
      console.log(`${name} has joined room: ${rName}`);

      // updates user.name
      setName(users, name, uid);

      // updates rooms and user.room and emit it to all the users in that room
      const room = addUserToRoom(rooms, rName, clientUser);
      io.to(rName).emit("display-users", getUsersInRoom(rooms, rName));
      io.to(rName).emit("update-room", room);
      // send users in room back to client
      callback(getUsersInRoom(rooms, rName));
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
  socket.on("choose-chooser", (roomName: string) => {
    // increment the turn counter for this room
    if (rooms[roomName]) {
      const roomTurn = ++rooms[roomName].turn;
      console.log("roomTurn", roomTurn);
      const roomUsers = getUsersInRoom(rooms, roomName);
      // chooser ID from [1, # users in room]
      let newChooserID;
      for (const userID in roomUsers) {
        if (
          roomUsers[userID].position ===
          roomTurn % Object.keys(roomUsers).length
        ) {
          newChooserID = userID;
        }
      }
      // update chooser for room
      const newChooser = getUser(users, newChooserID);
      console.log("new chooser is " + newChooserID, newChooser);
      rooms[roomName].chooser = newChooser;
      io.to(roomName).emit("chooser-chosen", newChooser);
    } else {
      console.log("rooms[rName] is null at choose-chooser");
    }
  });

  // update the users guesses
  socket.on("update-guess", (guess: string) => {
    if (clientUser && clientUser.room) {
      clientUser.guess = guess;
      const rName = clientUser.room;
      const room = rooms[rName];
      console.log("update-guess");
      io.to(rName).emit("display-users", getUsersInRoom(rooms, rName));
    } else {
      console.log("clientUser is null at update-guess");
    }
  });

  // update phase
  socket.on("update-phase", (phase: string) => {
    if (clientUser && clientUser.room) {
      const rName = clientUser.room;
      const room = rooms[rName];
      // this is to make sure we don't enter an infinite socket calling bullshit
      if (room.phase !== phase) {
        room.phase = phase;
        io.to(rName).emit("display-room", room, ["phase"]);
      } else {
        console.log(`room phase ${phase} is the same, no need to update`);
      }
    } else {
      console.log("clientUser is null at update-phase");
    }
  });

  // update video
  socket.on("update-video", (video: Video) => {
    if (clientUser && clientUser.room) {
      const rName = clientUser.room;
      const room = rooms[rName];
      // this is to make sure we don't enter an infinite socket calling bullshit
      if ( JSON.stringify(room.video) !==  JSON.stringify(video)) {
        room.video = video;
        io.to(rName).emit("display-room", room, ["video"]);
      } else {
        console.log(`room video ${video} is the same, no need to update`)
      }
    } else {
      console.log("clientUser is null at update-video");
    }
  });

  // user leave room
  socket.on("leave-room", (rName: string, user: User) => {
    const room = rooms[rName];
    if (room) {
      console.log(uid + " has left room:  " + room);
      // mutate user and rooms[uid]
      leaveRoomBig(clientUser, users, room, rooms, uid, io);
      removeUser(users, uid);
    } else {
      console.log("room is null at leave-room");
    }
  });

  // player leaves the game (why would they ever do this)
  socket.on("disconnect", () => {
    // remove user from users, then update client
    console.log(`${uid} has left`);
    // remove user from user and readyusers(if applicable) list
    if (clientUser) {
      const rName = getRoom(users, uid);
      const room = rooms[rName];
      if (room) {
        console.log("disconnect", clientUser, rooms);
        leaveRoomBig(clientUser, users, room, rooms, uid, io);
        removeUser(users, uid);
      } else {
        console.log("room is null at disconnect");
      }
    }
  });
});

// youtube api key
const API_KEY = process.env.API_KEY;
const watchURL = "https://www.youtube.com/watch?v=";

// helper to format Youtube API response
const formatVideoListData = (data: any): Video => {
  return data.map((video: any) => {
    let {
      snippet: {
        title,
        channelTitle,
        thumbnails: {
          high: { url },
        },
      },
      id: { videoId },
    } = video;
    if (!videoId) {
      videoId = "";
    }

    const videoURL = watchURL + videoId;
    return { title, channelTitle, imageURL: url, videoURL };
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
      console.log(url, data);

      const videoListData = { items: formatVideoListData(items) };
      res.header("Content-Type", "application/json");
      res.send(JSON.stringify(videoListData, null, 4));
      // res.send(data)
    })
    .catch((error: any) => {
      console.log(error);
    });
});

app.get("/", (req, res) => {
  res.send("<h1>bts</h1>");
});

const port = 5000;
http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
