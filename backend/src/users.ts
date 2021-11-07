type User = {
  id: string;
  position?: number;
  name?: string;
  room?: string;
  points: number;
  guess?: string;
  info(): string;
};

// maps user id to User object
type Users = Record<string, User>;

const userFactory = (id: string, name: string, room: string): User => {
  return {
    id: id,
    name: name,
    room: room,
    points: 0,
    position: undefined,
    guess: undefined,
    info(): string {
      return `${this.id} ${this.name}, ${this.room}`;
    },
  };
};

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

// mutates users array to contain new user [id]
const addUserToUsers = (users: Users, user: User, id: string): void => {
  users[id] = user;
};

// finds the user from id
const getUser = (users: Users, id: string): User => {
  return users[id]; // returns user object
};

// gets the room of a user
const getRoom = (users: Users, id: string): string | undefined => {
  let user = getUser(users, id);
  // if user exists, return their room - else undefined
  return user ? user.room : undefined;
};

// returns number of users in given users dict
const getUserCount = (users: Users): number => {
  return Object.keys(users).length;
};

// sets the room of a user
const setRoom = (users: Users, room: string, id: string): void => {
  // let user = getUser(users, id)
  // user.room = room
  let user = getUser(users, id);
  user.room = room;
};

// sets the name of a user
const setName = (users: Users, name: string, id: string): void => {
  let user = getUser(users, id);
  user.name = name;
};

// isekai's the user from existence
const removeUser = (users: Users, id: string): Users => {
  delete users[id];
  return users;
};

module.exports = {
  setName,
  setRoom,
  userFactory,
  removeUser,
  getUser,
  getRoom,
  addUserToUsers,
  getUserCount,
  createUser,
};
