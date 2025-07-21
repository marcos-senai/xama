let enPassantTarget = null; // Guarda a posição do peão que pode ser capturado en passantfunction movePiece(fromRow, fromCol, toRow, toCol) {
const piece = board[fromRow][fromCol];
const isPawnMove = piece.type === "pawn";
const isTwoSquaresMove = Math.abs(toRow - fromRow) === 2;

// Verifica se cria oportunidade para en passant
if (isPawnMove && isTwoSquaresMove) {
  enPassantTarget = { row: toRow, col: toCol };
} else {
  enPassantTarget = null;
}

// Captura en passant
if (isPawnMove && Math.abs(toCol - fromCol) === 1 && !board[toRow][toCol]) {
  board[toRow + (piece.color === "white" ? 1 : -1)][toCol] = null; // Remove o peão capturado
}
function checkPromotion(row, col) {
  const piece = board[row][col];
  if (piece.type === "pawn" && (row === 0 || row === 7)) {
    const promotionMenu = document.createElement("div");
    promotionMenu.innerHTML = `
                <div class="promotion-menu">
                    <div data-piece="queen">♕</div>
                    <div data-piece="rook">♖</div>
                    <div data-piece="bishop">♗</div>
                    <div data-piece="knight">♘</div>
                </div>
            `;
    document.body.appendChild(promotionMenu);

    promotionMenu.querySelectorAll("div").forEach((option) => {
      option.addEventListener("click", () => {
        piece.type = option.dataset.piece;
        renderBoard();
        promotionMenu.remove();
      });
    });
  }
}
let whiteTime = 600; // 10 minutos em segundos
let blackTime = 600;
let timerInterval;

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (currentPlayer === "white") whiteTime--;
    else blackTime--;

    document.getElementById("white-timer").textContent = formatTime(whiteTime);
    document.getElementById("black-timer").textContent = formatTime(blackTime);

    if (whiteTime <= 0 || blackTime <= 0) endGame("time");
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
function updateCurrentPlayerIndicator() {
  document
    .querySelectorAll(".square")
    .forEach((sq) => sq.classList.remove("current-player"));
  if (gameActive) {
    const squares = document.querySelectorAll(
      `.piece[data-color="${currentPlayer}"]`
    );
    squares.forEach((sq) =>
      sq.closest(".square").classList.add("current-player")
    );
  }
}
function movePiece() {
  // ... após mover peão
  if (piece.type === "pawn" && (row === 0 || row === 7)) {
    showPromotionMenu();
  }
}
function isKingInCheck(color) {
  // Verifica se algum movimento inimigo pode capturar o rei
}
// Adicionar ao seu jogo.js

// Variáveis globais
let socket;
let currentRoom;
let playerColor;

// Inicializar conexão Socket.io
function initMultiplayer() {
  socket = io('http://localhost:3001');
  
  // Ouvir eventos do servidor
  socket.on('game-started', (gameData) => {
    playerColor = gameData.players.find(p => p.id === socket.id).color;
    initGame(gameData.board);
    updatePlayerInfo(gameData.players);
  });
  
  socket.on('board-update', (newBoard) => {
    board = newBoard;
    renderBoard();
  });
  
  socket.on('turn-changed', (newTurn) => {
    currentPlayer = newTurn;
    updateStatus();
  });
  
  socket.on('game-ended', (message) => {
    gameActive = false;
    gameStatus.textContent = message;
  });
  
  socket.on('player-left', (username) => {
    alert(`${username} saiu do jogo!`);
    // Retornar ao menu principal
  });
}

// Criar sala
function createRoom(username) {
  socket.emit('create-room', username);
  socket.on('room-created', (roomId) => {
    currentRoom = roomId;
    showRoomScreen(roomId);
  });
}

// Entrar em sala
function joinRoom(roomId, username) {
  socket.emit('join-room', roomId, username);
}

// Enviar movimento
function sendMove(from, to) {
  socket.emit('move-piece', {
    roomId: currentRoom,
    from,
    to,
    playerColor
  });
}

// Modificar sua função movePiece
function movePiece(fromRow, fromCol, toRow, toCol) {
  // ... (lógica local existente)
  
  // Enviar movimento para o servidor
  sendMove(
    { row: fromRow, col: fromCol },
    { row: toRow, col: toCol }
  );
}