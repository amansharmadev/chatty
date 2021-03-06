const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const auth = require('./controllers/authy');

require('./socket/main.js');


app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*"); // allow request from all origin
  response.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  response.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, refreshToken"
  );

  next();
})
.use(bodyParser.json())
.use(
  bodyParser.urlencoded({
      extended: false,
      limit: "100mb"
  })
)
.use('/auth', auth);


app.listen(8080, ()=> { console.log("Server activated") });
http.createServer(app);