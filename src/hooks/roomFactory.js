const roomFactory = (rName, users, turn, phase, video, chooser) => {
  return {
    rName: rName,
    users: users,
    turn: turn,
    phase: phase,
    video: video,
    chooser: chooser
  };
};

export default roomFactory;
