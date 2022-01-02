const userFactory = (id, position, name, room, points, guess) => {
  return {
    id: id,
    position: position,
    name: name,
    room: room,
    points: points,
    guess: guess,

    info() {
      return `${this.id} ${this.name}, ${this.room}`;
    },
  };
};

export default userFactory;
