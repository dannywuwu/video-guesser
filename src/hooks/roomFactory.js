const roomFactory = (rName, users, turn, phase, chooser) => {
  return {
    rName: rName,
    users: users,
    turn: turn,
    phase: phase,
    chooser: chooser
  };
};

export default roomFactory;
