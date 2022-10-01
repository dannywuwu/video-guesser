
const express = require('express')
const morgan = require('morgan')
const fetch = require('node-fetch')
const cors = require('cors')
const app = express()
//middleware
app.use(morgan('tiny'))
app.use(cors())


const API_KEY = process.env.API_KEY

// const http = require('http');
// const server = http.createServer(app);


// const io = new Server(server);
// /* socket io stuff */
// const io = require('socket.io')(app, {
//     cors: {
//         origin: "https://Song-guesser.weelam.repl.co",
//         methods: ["GET", "POST"]
//     }
// })

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// return array of formatted objects

app.get('/', (req, res) => {
  res.send('<h1>bts</h1>')
})

// routes
app.get('/get/:search', (req, res) => {
  let search = req.params.search
  url = `https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=25&q=${search}`

  console.log(url)

  /*
  {
      id: {
          videoId
      },
      snippet: {
          title,
          channelTitle,
          thumbnails: {
              default: {
                  url,
                  width,
                  height
              },
              high: {
                  url,
                  width,
                  height
              }
          }
      }
  }
  */
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { items } = data;
      console.log(items);
      videoListData = { items: formatVideoListData(items) };
      res.header("Content-Type", 'application/json');
      // res.send(videoListData)
    //   res.send(data)
      res.send(JSON.stringify(videoListData, null, 4));
    })
})

// const notFound = (req, res, next) => {
//   res.status(404)
//   const Error = new Error('not found')
//   next(error)
// }

// const handleError = (err, req, res, next) => {
//   res.status(res.statusCode || 500);
//   res.json({
//     message: err.message
//   })
// }

// app.use(notFound)
// app.use(handleError)


/*** Build ************************************/
// app.use(express.static(path.join(__dirname, "../build")));

// // All routes other than above will go to index.html
// app.get("*", (req, res) => {
//     // send index.html
//     res.sendFile(path.join(__dirname, "../build/index.html"));
// });

// // Express server listening...
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Listening on port ${port}...`);
// });
