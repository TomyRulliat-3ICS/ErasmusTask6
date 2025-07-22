class Game {
  constructor() {
    this.board = new Board();
    this.currentPlayer = 'white';
    this.moveHistory = [];
    this.capturedPieces = [];
    this.init();
  }

  init() {
    this.board.render();
    this.updateTurnDisplay();
  }

  resetGame() {
    this.board = new Board();
    this.currentPlayer = 'white';
    this.moveHistory = [];
    this.capturedPieces = [];
    document.getElementById('move-history').innerHTML = '';
    document.getElementById('captured').innerHTML = '';
    this.board.render();
    this.updateTurnDisplay();
  }

  switchTurn() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.updateTurnDisplay();
  }

  updateTurnDisplay() {
    document.getElementById('turn-display').innerText = `Turn: ${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}`;
  }

  addMove(move) {
    this.moveHistory.push(move);
    const moveList = document.getElementById('move-history');
    const entry = document.createElement('li');
    entry.textContent = move;
    moveList.appendChild(entry);
  }

  capturePiece(piece) {
    this.capturedPieces.push(piece);
    const captured = document.getElementById('captured');
    const span = document.createElement('span');
    span.textContent = piece.symbol;
    captured.appendChild(span);
  }
}

class Board {
  constructor() {
    this.grid = this.createGrid();
  }

  createGrid() {
    const grid = [];
    for (let y = 0; y < 8; y++) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        row.push(null); // later fill with pieces
      }
      grid.push(row);
    }
    return grid;
  }

  render() {
    const board = document.getElementById('chessboard');
    board.innerHTML = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const square = document.createElement('div');
        square.className = `square ${(x + y) % 2 === 0 ? 'light' : 'dark'}`;
        square.dataset.x = x;
        square.dataset.y = y;
        board.appendChild(square);
      }
    }
  }
}

const game = new Game();
