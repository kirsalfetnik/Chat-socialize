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
});