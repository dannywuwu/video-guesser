// update Chooser
export const updateChooser = (socket, room) => {
  socket.emit("choose-chooser", room);
};


// give points to selected players
// called once Chooser submits correct players
export const updatePoints = () => {};

export const startVideoTimer = (progress, setProgress, videoTime) => {
	setProgress({percent: 0, intervalID: 0})
  // start the video and the timer
  const interval = setInterval(() => {
    if (progress >= videoTime) {
      clearInterval(interval);
    }
    setProgress((prev) => ({ ...prev, percent: prev["percent"] + 0.1 }));
  }, 100);
  setProgress((prev) => ({ ...prev, intervalID: interval }));
};

export const sortLeaderboard = (user1, user2) => {
  if (user1.points < user2.points) {
    return 1
  } else {
    return -1
  }
}