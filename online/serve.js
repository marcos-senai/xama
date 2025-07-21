const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Armazenamento em memória (substituir por DB em produção)
const rooms = {};
const players = {};

io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Criar sala
  socket.on("create-room", (username) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
      players: [
        {
          id: socket.id,
          username,
          color: "white",
        },
      ],
      board: null,
      status: "waiting",
    };

    socket.join(roomId);
    players[socket.id] = { roomId, username };
    socket.emit("room-created", roomId);
  });

  // Entrar em sala
  socket.on("join-room", (roomId, username) => {
    if (rooms[roomId] && rooms[roomId].players.length < 2) {
      rooms[roomId].players.push({
        id: socket.id,
        username,
        color: "black",
      });

      rooms[roomId].status = "playing";
      socket.join(roomId);
      players[socket.id] = { roomId, username };

      // Iniciar jogo
      io.to(roomId).emit("game-started", {
        players: rooms[roomId].players,
        board: initializeBoard(),
      });
    } else {
      socket.emit("join-error", "Sala cheia ou inexistente");
    }
  });

  // Movimento de peça
  socket.on("move-piece", (moveData) => {
    const playerData = players[socket.id];
    if (!playerData) return;

    const roomId = playerData.roomId;
    const room = rooms[roomId];

    // Validar movimento e atualizar tabuleiro
    if (validateMove(room.board, moveData)) {
      room.board = applyMove(room.board, moveData);

      // Atualizar todos os jogadores
      io.to(roomId).emit("board-update", room.board);
      io.to(roomId).emit(
        "turn-changed",
        getOppositeColor(moveData.playerColor)
      );

      // Verificar xeque-mate
      if (isCheckmate(room.board, getOppositeColor(moveData.playerColor))) {
        io.to(roomId).emit("game-ended", `Vitória das ${moveData.playerColor}`);
      }
    }
  });

  // Desconexão
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    const playerData = players[socket.id];
    if (playerData) {
      const roomId = playerData.roomId;
      delete players[socket.id];

      if (rooms[roomId]) {
        io.to(roomId).emit("player-left", playerData.username);
        delete rooms[roomId];
      }
    }
  });
});

// Funções auxiliares
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function initializeBoard() {
  // Implementar lógica de inicialização do tabuleiro
  // (Similar ao seu setupPieces() atual)
}

function validateMove(board, move) {
  // Implementar lógica de validação
  // (Similar ao seu calculateValidMoves() atual)
}

server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
