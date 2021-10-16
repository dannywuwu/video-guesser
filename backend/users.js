const userFactory = (id, order, name, room, points, isChooser, guess) => {
    return {
        id: id,
        order: order,
        name: name,
        room: room,
        points: points,
        guess: guess,
        isChooser: isChooser,
        info() {
            return `${this.id} ${this.name}, ${this.room}`;
        }
    };
};

// finds the user from id
const getUser = (users, id) => {
  // return users.find(user => {
  //   return user.id === id
  // })
  return users[id] // returns user object 
}

// gets the room of a user
const getRoom = (users, id) => {
  // let user = getUser(users, id) 
  // if (user) return user.room
  // else return null
  let user = getUser(users, id)
  if (user) return user.room
  else return null
}

// sets the room of a user
const setRoom = (users, room, id) => {
  // let user = getUser(users, id) 
  // user.room = room
  let user = getUser(users, id)
  user.room = room
}

// sets the name of a user
const setName = (users, name, id) => {
  let user = getUser(users, id)
  user.name = name
}

// isekai's the user from existence
const removeUser = (users, id) => {
  delete users[id]
  return users
}
module.exports = {setName, setRoom, userFactory, removeUser, getUser, getRoom}