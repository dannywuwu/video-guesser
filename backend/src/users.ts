interface User {
  id: number;
  order: number;
  name?: string;
  room?: string;
  points: number;
  isChooser: boolean;
  guess?: string;
  info(): string;
}

const userFactory = (user: User): User => {
  const { id, order, name, room, points, isChooser, guess } = user;
  return {
    id: id,
    order: order,
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
const getUser = (users: User[], id: number): User => {
  // return users.find(user => {
  //   return user.id === id
  // })
  return users[id]; // returns user object
};

// gets the room of a user
const getRoom = (users: User[], id: number): string | undefined => {
  // let user = getUser(users, id)
  // if (user) return user.room
  // else return null
  let user = getUser(users, id);
  // if user exists, return their room - else undefined
  return user ? user.room : undefined;
};

// sets the room of a user
const setRoom = (users: User[], room: string, id: number): void => {
  // let user = getUser(users, id)
  // user.room = room
  let user = getUser(users, id);
  user.room = room;
};

// sets the name of a user
const setName = (users: User[], name: string, id: number): void => {
  let user = getUser(users, id);
  user.name = name;
};

// isekai's the user from existence
const removeUser = (users: User[], id: number): User[] => {
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
