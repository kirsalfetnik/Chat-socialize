require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

// express app
const app = express();
const server = require('http').createServer(app);

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database');
        // listen to port
        server.listen(process.env.PORT, () => {
            console.log('listening for requests on port', process.env.PORT)
        });
    })    
    .catch((err) => {
        console.log(err);
    });

/*
const io = require('socket.io')(app.listen(server, {
    pingTimeout: 60000,
    cors: {
        origin: `http://localhost:${process.env.PORT}`
    }
}));

io.on("Connection", (socket) => {
    console.log("Connected to socket.io");
})
*/

app.use(cors()); // Use this after the variable declaration

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: `http://localhost:3000`,
        credentials: true
    }
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on('setup', (userData) => {
    socket.join(userData.user_Id);
    console.log(userData.user_Id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
        if(user._id == newMessageReceived.sender._id) return;

        socket.in(user._id).emit('message received', newMessageReceived);
    });
  })
});