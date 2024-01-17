const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server, Namespace} = require("socket.io");
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {
    cors : {
        origin: " http://localhost:5173",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {

    console.log(socket.nsp.sockets.size);

const id = socket.id;

socket.on("join_room", (data) => {
    socket.join(data);
})

socket.on("typing", (data) => {
    console.log(data.name);
    const name = data.name;
    const status = data.isTyping;
    socket.to(data.room).emit("heIsTyping", {name, status});
    console.log('emitted')
})

socket.on("send_message", (data) => {
    console.log(socket.handshake.time);
    const msg = data.message;
    socket.userData = {
        name : data.name,
    };
    const username = socket.userData.name;
    const time = data.time;
    const noOfUsers = socket.nsp.sockets.size;
    socket.to(data.room).emit("receive_message", {msg, id, username, time, noOfUsers});
    
})


})

server.listen(process.env.port, () => {
    console.log(`Server is listening on port ${process.env.port}`);
})