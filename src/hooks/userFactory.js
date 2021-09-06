
const userFactory = (id, name, room) => {
    return {
      id: id,
      name: name,
      room: room,
      info() {
        return `${this.id} ${this.name}, ${this.room}`;
      }
    };
  };

export default userFactory;