const app = require("./app");
const debug = require("debug")("SocioWise");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
const io = require('./socket').intit(server);
io.on('connection', Socket => {
  
  Socket.on('join', function(data){

    Socket.join(data.room);

    Socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});

  });

  Socket.on('leave', function(data){

    Socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

    Socket.leave(data.room);

  });

  Socket.on('message',function(data){
    io.in(data.room).emit('new message', {messageID: data.messageID, user:data.user, username:data.username, message:data.message, room: data.room, time:data.time});
  });

  Socket.on('delete',function(data){
    io.in(data.room).emit('delete message', {messageID: data.messageID, user:data.user, username:data.username, message:data.message, room: data.room, time:data.time});
  });

});