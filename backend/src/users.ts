type User = {
  id: string;
  position?: number;
  name?: string;
  room?: string;
  points: number;
  isChooser: boolean;
  guess?: string;
  info(): string;
};

// maps user id to User object
type Users = Record<string, User>;

const userFactory = (id: string, name: string, room: string): User => {
  return {
    id: id,
    position: undefined,
    name: name,
    room: room,
    points: 0,
    guess: undefined,
    isChooser: false,
    info(): string {
      return `${this.id} ${this.name}, ${this.room}`;
    },
  };
};

// finds the user from id
const getUser = (users: Record<string, User>, id: string): User => {
  return users[id]; // returns user object
};

// gets the room of a user
const getRoom = (
  users: Record<string, User>,
  id: string
): string | undefined => {
  let user = getUser(users, id);
  // if user exists, return their room - else undefined
  return user ? user.room : undefined;
};

// sets the room of a user
const setRoom = (
  users: Record<string, User>,
  room: string,
  id: string
): void => {
  // let user = getUser(users, id)
  // user.room = room
  let user = getUser(users, id);
  user.room = room;
};

// sets the name of a user
const setName = (
  users: Record<string, User>,
  name: string,
  id: string
): void => {
  let user = getUser(users, id);
  user.name = name;
};

// isekai's the user from existence
const removeUser = (
  users: Record<string, User>,
  id: string
): Record<string, User> => {
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
};
