//  Node Server Which will Handle socket io Connnections
const http = require('http');
const { Server } = require('socket.io');

const express = require('express');

const app = express();
const PORT = 80;

const server = http.createServer(app);
const io = new Server(server);

const users = {};
// socket.io
io.on('connection', (socket)=>{
    socket.on('new-user-joined',(name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message:message, name:users[socket.id]});
    });

    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

app.use(express.static('../public'));

app.get('/', (req, res)=>{
    return res.send('../public/index.html');
});
server.listen(PORT, ()=> console.log( `Server Started at PORT: ${PORT}`));