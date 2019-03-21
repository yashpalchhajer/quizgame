"use strict";

const express = require('express');
let http = require('http');
let app = express();
let server = http.createServer(app);
let cors = require('cors');
let io = require('socket.io').listen(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

let mysql = require('mysql');
let connectionDetails = {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'quizegame',
    charset: "LATIN1"
};

app.get('/', (req, res) => {
    res.send('Chat is running');
});

app.use(bodyParser.json());

app.post('/register', (req, res) => {
    registerUser(req.body, function (insId) {
        console.log('inserted' + insId);
        res.send({ "re_id": insId });
    });
});

function registerUser(data, callback) {
    let qry = `INSERT INTO active_users (user_id,is_active,is_paired) VALUES(${data.user_id},'1','0')`;
    let connection = mysql.createConnection(connectionDetails);

    connection.query(qry, function (error, result, fields) {
        if (error) {
            throw error;
        }
        callback(result.insertId);
        // insertId = result.insertId;
        // res.send({"ins_id":insertId});
    });
    connection.end();
}


// handle incoming connections from clients
io.sockets.on('connection', function (socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    console.log('connection added');
    // console.log(socket);
    socket.on('room', function (room) {
        console.log(room);
        socket.join(room);
    });
});

// now, it's easy to send a message to just the clients in a given room
let room = "abc123";
io.sockets.in(room).emit('message', 'what is going on, party people?');

// this message will NOT go to the client defined above
io.sockets.in('foobar').emit('message', 'anyone in this room yet?');


/* 
io.on('connnection', (socket) => {
    console.log('user connected');
    socket.on('join', function (userName) {
        console.log('user ' + userName);
        // socket.broadCast.emit('userJoinedChat',userName + ": has joined");
    });

    socket.on('messagedetection', (senderName, messageContent) => {
        console.log(senderName + ":" + messageContent);

        let message = { "message": messageContent, "senderickName": senderName };
        io.emit('message', message);
        socket.on('disconnect', function () {
            console.log(userName + 'has left');
            socket.broadCast.emit('userDisconnect', ' user has left');
        });
    });
});
 */
server.listen(3000, () => {
    console.log('Node app is running on port 3000');
});
