const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5500', 
        methods: ['GET', 'POST']
    }
});

app.use(cors());

const users = {};

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // Handle text messages
    socket.on('send', ({ message, name }) => {
        console.log(`Message from ${name}: ${message}`);
        
        // ✅ Fix: Send to everyone *except* sender
        socket.broadcast.emit('receive', { message, name });
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            io.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
