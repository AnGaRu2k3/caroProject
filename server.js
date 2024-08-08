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
        console.log('Player joined with nickname:', data.nickname, 'and gender:', data.gender, 'and socketi=Id: ', socket.id);
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
    socket.on('make_move', (data) => {
        const { gameId, squares, xIsNext, i } = data;
        console.log(gameId)
        const roomInfo = rooms[gameId];
        console.log("room info is", roomInfo)
        console.log("socketID info is", socket.id)
        // exit(0)
        const opponent = roomInfo.find(player => player.socketId !== socket.id);
        if (opponent) {
            io.to(opponent.socketId).emit('move_made', { squares, xIsNext, i });
        }
        socket.emit('move_made', { squares, xIsNext, i });
    });
    socket.on('player_ready', (gameId) => {
        const room = rooms[gameId]; 
        console.log(room);
        if (room) {
            const opponent = room.find(player => player.socketId !== socket.id);
            console.log(opponent.socketId)
            if (opponent) {
                io.to(opponent.socketId).emit('opponent_ready');
            }
        }
    });
    
    socket.on('cancel_ready', (gameId) => {
        const room = rooms[gameId]; 
        if (room) {
            const opponent = room.find(player => player.socketId !== socket.id);
            if (opponent) {
                io.to(opponent.socketId).emit('opponent_cancel');
            }
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete socketInfo[socket.id];
    });
    socket.on('get_room_information', (gameId) => {
        const roomInfo = rooms[gameId];
        const playersInfo = {};
        const playerIndex = roomInfo.findIndex(player => player.socketId === socket.id);


        playersInfo.player = {
            ...socketInfo[socket.id],
            socketId: socket.id,
            isX: roomInfo[playerIndex].isX
        };
        const opponentIndex = 1 - playerIndex;
        playersInfo.opponent = {
            ...socketInfo[roomInfo[opponentIndex].socketId],
            socketId: roomInfo[opponentIndex].socketId,
            isX: roomInfo[opponentIndex].isX
        };
        socket.emit('room_information', playersInfo);
    });
});

function findAvailableRoom() {
    for (const roomId in rooms) {
        if (rooms[roomId].length === 1) {
            return roomId;
        }
    }
    return null;
}
function createRoom() {
    const roomId = Math.random().toString(36).substr(2, 9);
    rooms[roomId] = [];
    return roomId;
}
function joinRoom(roomId, socket) {
    if (rooms[roomId].length == 0) {
        rooms[roomId].push({ "socketId": socket.id, "isX": 0 });
    }
    else rooms[roomId].push({ "socketId": socket.id, "isX": 1 });
    socket.emit('room_created', { roomId });

    // If room is full (2 players), start the game
    if (rooms[roomId].length === 2) {
        const players = rooms[roomId];

        io.to(players[0].socketId).emit('start_game', { roomId: roomId, opponentSocketId: players[1].socketId });
        io.to(players[1].socketId).emit('start_game', { roomId: roomId, opponentSocketId: players[0].socketId });
    }
}
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});