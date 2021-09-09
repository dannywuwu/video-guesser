const userFactory = (id, name, room, points, isChooser, guess) => {
  return {
    id: id,
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


export default userFactory;