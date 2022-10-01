# Video Guesser: A multiplayer party quiz focused on guessing the Youtube video being played!

## How to play:

Players first enter a name and a room. Once everyone in the room is ready, the game begins.
<img src="https://github.com/dannywuwu/video-guesser/blob/master/readme_res/1-room-creation.PNG" />

Each round, a Chooser is selected. They search for a Youtube video in the searchbar (using the Youtube API) and select a video to play.

<img src="https://github.com/dannywuwu/video-guesser/blob/master/readme_res/2-choosing-video.PNG" />

The video plays for 10 seconds, with the chooser having the ability to manually blur/unblur the video for guessers as well as pause. This behaviour is synchronized throughout all players in the room.

<img src="https://github.com/dannywuwu/video-guesser/blob/master/readme_res/3-chooser-control.PNG" />
<img src="https://github.com/dannywuwu/video-guesser/blob/master/readme_res/4-guesser-blur.PNG" />

After the 10 seconds, Guessers have the opportunity to guess the video. If they guess correctly, the Chooser marks them as correct and they receive points. 
Whoever has the most points in the end, wins!

# Technologies Used
## Frontend: React with the Ant Design UI library

## Backend: Node with TypeScript and Socket.IO websockets

# How to run:
1. Install dependencies: `$ npm install`
2. Run frontend: `$ npm start`
3. Run backend: `$ cd backend && npm start`
