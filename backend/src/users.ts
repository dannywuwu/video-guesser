type User = {
  id: number;
  position: number;
  name?: string;
  room?: string;
  points: number;
  isChooser: boolean;
  guess?: string;
  info(): string;
};

// maps user id to User object
type Users = Record<string, User>;

const userFactory = (user: User): User => {
  const { id, position, name, room, points, isChooser, guess } = user;
  return {
    id: id,
    position: position,
    name: name,
    room: room,
    points: points,
    guess: guess,
    isChooser: isChooser,
    info(): string {
      return `${this.id} ${this.name}, ${this.room}`;
    },
  };
};

// finds the user from id
const getUser = (users: Record<string, User>, id: number): User => {
  return users[id]; // returns user object
};

// gets the room of a user
const getRoom = (
  users: Record<string, User>,
  id: number
): string | undefined => {
  // let user = getUser(users, id)
  // if (user) return user.room
  // else return null
  let user = getUser(users, id);
  // if user exists, return their room - else undefined
  return user ? user.room : undefined;
};

// sets the room of a user
const setRoom = (
  users: Record<string, User>,
  room: string,
  id: number
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
  id: number
): void => {
  let user = getUser(users, id);
  user.name = name;
};

// isekai's the user from existence
const removeUser = (
  users: Record<string, User>,
  id: number
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
