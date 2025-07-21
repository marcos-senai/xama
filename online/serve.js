const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Armazenamento de salas
const rooms = {};

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Criar uma nova sala
  socket.on('createRoom', (username) => {
    const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    rooms[roomId] = {
      players: [{ id: socket.id, username, color: 'white' }],
      board: null
    };
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    console.log(`Sala criada: ${roomId}`);
  });

  // Entrar em uma sala existente
  socket.on('joinRoom', (roomId, username) => {
    if (rooms[roomId] && rooms[roomId].players.length < 2) {
      const color = rooms[roomId].players[0].color === 'white' ? 'black' : 'white';
      rooms[roomId].players.push({ id: socket.id, username, color });
      socket.join(roomId);
      
      // Notificar ambos os jogadores
      io.to(roomId).emit('playerJoined', rooms[roomId].players);
      
      // Se a sala está cheia, iniciar o jogo
      if (rooms[roomId].players.length === 2) {
        io.to(roomId).emit('gameStart', color);
      }
    } else {
      socket.emit('roomError', 'Sala cheia ou inexistente');
    }
  });

  // Movimento de peça
  socket.on('move', (roomId, moveData) => {
    if (rooms[roomId]) {
      // Atualizar estado do tabuleiro
      rooms[roomId].board = moveData.board;
      
      // Enviar movimento para o outro jogador
      socket.to(roomId).emit('opponentMove', moveData);
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    // Limpar salas vazias
    Object.keys(rooms).forEach(roomId => {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});