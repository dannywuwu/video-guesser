const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

const { userFactory, addUserToUsers, setName } = require("../build/users.js");

const { addUserToRoom } = require("../build/room.js");

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

  describe("choose-chooser tests", () => {
    let joseph;

    beforeAll(() => {
      // user setup
      joseph = userFactory("id1", "joseph", "room1");
      addUserToUsers(users, joseph, "id1");
      addUserToRoom(rooms, "room1", joseph);
    });

    it("choose-chooser new room", (done) => {
      // socket setup
      serverSocket.on("choose-chooser", (roomID) => {
        // choosing the chooser phase
        // increment the turn counter for this room
        rooms[roomID].turn += 1;
        const roomTurn = rooms[roomID].turn;
        const roomUsers = getUsersInRoom(rooms, roomID);
        // chooser ID from [1, # users in room]
        const newChooserID = roomUsers.find(
          (user) => user.position == roomTurn % roomUsers.length
        );
        // update chooser for room
        const newChooser = getUser(users, newChooserID);
        rooms[roomID].chooser = newChooser;

        // turn incremented
        expect(rooms["room1"].turn).toBe(1);
        // joseph is now chooser
        expect(rooms["room1"].chooser).toBe(joseph);
      });
      // new room starts at turn 0
      expect(rooms["room1"].turn).toBe(0);
      // new room position starts at 0
      expect(users["id1"].position).toBe(1);

      clientSocket.emit("choose-chooser", "room1");

      done();
    });

    // should choose every player once in a cycle
    it("choose-chooser full cycle", (done) => {
      done();
    });
  });
});
