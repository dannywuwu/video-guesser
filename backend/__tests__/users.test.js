const user = require("../build/users.js");

const u1 = user.userFactory("id1", "jotaro", "room1");

const users = {
  id1: u1,
};

it("should return user object", () => {
  expect(user.getUser(users, "id1")).toBe(u1);
});

it("should return user count", () => {
  expect(user.getUserCount(users)).toBe(1);
});

it("should add user", () => {
  const u2 = user.userFactory("id2", "koichi", "room1");
  const userCount = Object.keys(users).length;
  user.addUserToUsers(users, u2, "id2");
  const newUserCount = Object.keys(users).length;
  expect(userCount == newUserCount - 1);
  expect(users["id2"]).toBe(u2);
});

it("should destroy the user", () => {
  const u3 = user.userFactory("id3", "okuyasu", "room3");
  user.addUserToUsers(users, u3, "id3");
  const count = user.getUserCount(users);
  user.removeUser(users, "id3");
  const newCount = user.getUserCount(users);
  expect(count == newCount + 1);
  expect(!users["id3"]);
});

describe("user room tests", () => {
  it("should return user room id", () => {
    expect(user.getRoom(users, "id1")).toBe("room1");
  });

  it("should return undefined if user does not exist", () => {
    expect(user.getRoom(users, "nonexistid")).toBe(undefined);
  });

  it("should mutate user name", () => {
    user.setName(users, "josuke", "id1");
    // update user
    expect(u1.name).toBe("josuke");
    // update users dict
    expect(users[u1.id].name).toBe("josuke");
  });
});
