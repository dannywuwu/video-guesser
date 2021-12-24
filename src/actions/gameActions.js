// update Chooser
export const updateChooser = (socket, room) => {
  socket.emit("choose-chooser", room);
};
// return true if current user is chooser
export const isChooser = (socketID, chooserID) => {
  return socketID === chooserID ? true : false;
};

// give points to selected players
// called once Chooser submits correct players
export const updatePoints = () => {};

export const startVideo = (progress, setProgress, videoTime) => {
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
