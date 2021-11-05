const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

const { userFactory, addUserToUsers, setName } = require("../build/users.js");

const { addUserToRoom } = require("../build/room.js");
const { join } = require("path");

describe("socket tests", () => {
  /* socket.io testing setup */
  let io, serverSocket, clientSocket;
  /* custom */
  let user, uid;
  let users, rooms;

  // create new http server before each test with a socket
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);

    /* custom */
    users = {};
    rooms = {};

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;

        /* custom */
        // create user object
        user = userFactory(socket.id);
        // ID of the current user
        uid = user.id;
        // add user to users{} dict
        addUserToUsers(users, user, uid);
      });
      clientSocket.on("connect", () => {
        done();
      });
    });
  });

  afterAll(() => {
    // cleanup
    io.close();
    clientSocket.close();
  });

  /* end of socket.io test setup*/

  it("should join room", (done) => {
    serverSocket.on("join-room", (name, room) => {
      // updates user.name
      setName(users, name, uid);
      // updates rooms and user.room
      addUserToRoom(rooms, room, user);

      // mutations should have happened
      expect(users[uid].name).toBe(name);
      expect(users[uid].room).toBe(room);
      expect(rooms[room][uid]).toBeFalsy();
    });

    clientSocket.emit("join-room", "carlos", "sinnoh1");
    done();
  });
});
