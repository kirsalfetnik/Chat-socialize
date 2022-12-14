require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const e = require('express');

// express app
const app = express();
const server = require('http').createServer(app);

// middleware
app.use(express.json());

app.use((req, res, next) => {
    // console.log(req.path, req.method);
    next();
})

// routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


//*********************** Deployment *******************

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get('*', (req, res) => {
        // res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));

        const index = path.join(__dirname1, 'frontend', 'build', 'index.html');
        res.sendFile(index);
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    })
}

//*********************** Deployment *******************


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


// Socket.io
app.use(cors());

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        // origin: `http://localhost:3000`,
        origin: `http://localhost:4000`,
        credentials: true
    }
});

io.on("connection", (socket) => {

  socket.on('setup', (userData) => {
    socket.join(userData.user_Id);
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
  });

  socket.off('setup', () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.user_Id);
  })

});