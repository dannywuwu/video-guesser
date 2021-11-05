const { addUserToRoom, leaveRoom } = require("../build/room.js");

const user = require("../build/users.js");

const u1 = user.userFactory("id1", "jotaro", "room1");

const users = {
  id1: u1,
};

it("should create a new room containing user", () => {
  const rooms = {
    room1: {
      users: users,
      turn: 1,
    },
  };
  addUserToRoom(rooms, "room2", u1);
  // room2 should now exist containing user
  expect(rooms["room2"]);
  expect(rooms["room2"]["users"]);
  expect(rooms["room2"]["users"]["id1"]).toBe(u1);
  expect(u1.room).toBe("room2");
});

it("should remove user from room and mutate rooms", () => {
  const rooms = {
    room1: {
      users: users,
      turn: 1,
    },
  };
  leaveRoom(u1, rooms);
  // mutated rooms
  expect(u1.room).toBeFalsy();
  // mutated users
  expect(rooms["room1"]["users"][u1]).toBeFalsy();
});

it("should overwrite user room", () => {
  const u3 = user.userFactory("id3", "koichi", "room3");
  const rooms = {
    room1: {
      users: {
        id3: u3,
      },
      turn: 1,
    },
  };
  expect(u3.room).toBe("room3");
  addUserToRoom(rooms, "anotha room", u3);
  // mutated user
  expect(u3.room).toBe("anotha room");
  // mutated rooms
  expect(rooms["anotha room"]["users"][u3.id]).toBeTruthy();
});

it("should add user to existing room", () => {
  const u2 = user.userFactory("id2", "josuke", undefined);
  const rooms = {
    room1: {
      users: {},
      turn: 1,
    },
  };
  expect(u2.room).toBeFalsy();
  addUserToRoom(rooms, "room2", u2);
  // mutated rooms
  expect(rooms["room2"]["users"][u2.id]).toBe(u2);
  // mutated user
  expect(u2.room).toBe("room2");
});
