const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

let rooms = {};
let socketInfo = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join_game', (data) => {
        console.log('Player joined with nickname:', data.nickname, 'and gender:', data.gender);
        socketInfo[socket.id] = {
            nickname: data.nickname,
            gender: data.gender
        };
        let room = findAvailableRoom();
        if (room) {
            joinRoom(room, socket);
        } else {
            room = createRoom();
            joinRoom(room, socket);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete socketInfo[socket.id];
    });
    socket.on('get_room_information', (data) => {
        const roomInfo = rooms[data.gameId]
        console.log(roomInfo);
        socket.emit('room_information', roomInfo);
    });
});

function findAvailableRoom() {
    for (const roomId in rooms) {
        if (rooms[roomId].players.length === 1) {
            return roomId;
        }
    }
    return null;
}
function createRoom() {
    const roomId = Math.random().toString(36).substr(2, 9);
    rooms[roomId] = { players: [] };
    return roomId;
}
function joinRoom(roomId, socket) {
    rooms[roomId].players.push(socket.id);
    socket.emit('room_created', { roomId });

    // If room is full (2 players), start the game
    if (rooms[roomId].players.length === 2) {
        const players = rooms[roomId].players;
        io.to(players[0]).emit('start_game', { roomId: roomId, opponentSocketId: players[1] });
        io.to(players[1]).emit('start_game', { roomId: roomId, opponentSocketId: players[0] });
    }
}
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});