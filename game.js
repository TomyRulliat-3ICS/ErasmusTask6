const PIECE_IMAGES = {
    wp: 'pieces/wp.png',
    wr: 'pieces/wr.png',
    wn: 'pieces/wn.png',
    wb: 'pieces/wb.png',
    wq: 'pieces/wq.png',
    wk: 'pieces/wk.png',
    bp: 'pieces/bp.png',
    br: 'pieces/br.png',
    bn: 'pieces/bn.png',
    bb: 'pieces/bb.png',
    bq: 'pieces/bq.png',
    bk: 'pieces/bk.png'
    };

  // Classes pour gérer le jeu et pièces
  class Piece {
    constructor(color, row, col) {
      this.color = color; // 'w' or 'b'
      this.row = row;
      this.col = col;
      this.type = null; // pawn: p, rook: r, knight: n, bishop: b, queen: q, king: k
      this.hasMoved = false; // utile pour roque et promotion
    }
    clone() {
      const copy = new this.constructor(this.color, this.row, this.col);
      copy.hasMoved = this.hasMoved;
      return copy;
    }
    inBounds(r, c) {
      return r >= 0 && r < 8 && c >= 0 && c < 8;
    }
    // retourne la liste des mouvements "bruts", sans tester le check ni autres règles spécifiques
    getMoves(board) {
      return [];
    }
  }

  class Pawn extends Piece {
    constructor(color, row, col) {
      super(color, row, col);
      this.type = 'p';
    }
    getMoves(board, enPassantTarget) {
      const moves = [];
      const dir = this.color === 'w' ? -1 : 1;
      const startRow = this.color === 'w' ? 6 : 1;
      const r = this.row;
      const c = this.col;

      // avancer 1 case
      if (this.inBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        // avancer 2 cases si à la position initiale
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // capture diagonale
      for (const dc of [-1, 1]) {
        const nr = r + dir;
        const nc = c + dc;
        if (this.inBounds(nr, nc)) {
          const target = board[nr][nc];
          if (target && target.color !== this.color) {
            moves.push([nr, nc]);
          } else if (enPassantTarget && enPassantTarget[0] === nr && enPassantTarget[1] === nc) {
            moves.push([nr, nc]);
          }
        }
      }
      return moves;
    }
  }

  class Rook extends Piece {
    constructor(color, row, col) {
      super(color, row, col);
      this.type = 'r';
    }
    getMoves(board) {
      return this._linearMoves(board, [[1,0],[-1,0],[0,1],[0,-1]]);
    }
    _linearMoves(board, directions) {
      const moves = [];
      const r = this.row;
      const c = this.col;
      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (this.inBounds(nr, nc)) {
          if (!board[nr][nc]) {
            moves.push([nr, nc]);
          } else {
            if (board[nr][nc].color !== this.color) {
              moves.push([nr, nc]);
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      return moves;
    }
  }

  class Knight extends Piece {
    constructor(color, row, col) {
      super(color, row, col);
      this.type = 'n';
    }
    getMoves(board) {
      const moves = [];
      const r = this.row;
      const c = this.col;
      const steps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of steps) {
        const nr = r + dr;
        const nc = c + dc;
        if (this.inBounds(nr, nc)) {
          if (!board[nr][nc] || board[nr][nc].color !== this.color) {
            moves.push([nr, nc]);
          }
        }
      }
      return moves;
    }
  }

  class Bishop extends Piece {
    constructor(color, row, col) {
      super(color, row, col);
      this.type = 'b';
    }
    getMoves(board) {
      return this._linearMoves(board, [[1,1],[-1,1],[1,-1],[-1,-1]]);
    }
    _linearMoves(board, directions) {
      const moves = [];
      const r = this.row;
      const c = this.col;
      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (this.inBounds(nr, nc)) {
          if (!board[nr][nc]) {
            moves.push([nr, nc]);
          } else {
            if (board[nr][nc].color !== this.color) {
              moves.push([nr, nc]);
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      return moves;
    }
  }

  class Queen extends Piece {
    constructor(color, row, col) {
      super(color, row, col);
      this.type = 'q';
    }
    getMoves(board) {
      return this._linearMoves(board, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]);
    }
    _linearMoves(board, directions) {
      const moves = [];
      const r = this.row;
      const c = this.col;
      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (this.inBounds(nr, nc)) {
          if (!board[nr][nc]) {
            moves.push([nr, nc]);
          } else {
            if (board[nr][nc].color !== this.color) {
              moves.push([nr, nc]);
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      return moves;
    }
  }

  class King extends Piece {
    constructor(color, row, col) {
      super(color, row, col);
      this.type = 'k';
    }
    getMoves(board, canCastleKingside, canCastleQueenside) {
      const moves = [];
      const r = this.row;
      const c = this.col;
      const deltas = [
        [-1,-1],[-1,0],[-1,1],
        [0,-1],       [0,1],
        [1,-1], [1,0], [1,1]
      ];
      for (const [dr, dc] of deltas) {
        const nr = r + dr;
        const nc = c + dc;
        if (this.inBounds(nr, nc)) {
          if (!board[nr][nc] || board[nr][nc].color !== this.color) {
            moves.push([nr, nc]);
          }
        }
      }
      // Castle conditions added in Game logic, but suggest squares here:
      if (!this.hasMoved) {
        if (canCastleKingside) {
          moves.push([r, c + 2]);
        }
        if (canCastleQueenside) {
          moves.push([r, c - 2]);
        }
      }
      return moves;
    }
  }

  // Classe principale Game qui gère l’état, les règles, le plateau
  class Game {
    constructor() {
      this.board = this.createBoard();
      this.currentTurn = 'w';
      this.selected = null; // [row,col] sélectionné
      this.enPassantTarget = null; // case cible prise en passant (row,col) ou null
      this.moveHistory = [];
      this.capturedWhite = [];
      this.capturedBlack = [];
      this.statusElem = document.getElementById('status');
      this.moveHistoryElem = document.getElementById('moveHistory');
      this.capturedWhiteElem = document.getElementById('capturedWhite');
      this.capturedBlackElem = document.getElementById('capturedBlack');
      this.draggedPiece = null;
      this.draggedFrom = null;
      this.castlingRights = { wK: true, wQ: true, bK: true, bQ: true }; // droit au roque
      this.inCheck = false;
      this.gameOver = false;
      this.render();
      this.updateStatus();
    }

    createBoard() {
      const board = Array(8).fill(null).map(() => Array(8).fill(null));
      // Place pawns
      for (let c = 0; c < 8; c++) {
        board[6][c] = new Pawn('w', 6, c);
        board[1][c] = new Pawn('b', 1, c);
      }
      // Rooks
      board[7][0] = new Rook('w', 7, 0);
      board[7][7] = new Rook('w', 7, 7);
      board[0][0] = new Rook('b', 0, 0);
      board[0][7] = new Rook('b', 0, 7);
      // Knights
      board[7][1] = new Knight('w', 7, 1);
      board[7][6] = new Knight('w', 7, 6);
      board[0][1] = new Knight('b', 0, 1);
      board[0][6] = new Knight('b', 0, 6);
      // Bishops
      board[7][2] = new Bishop('w', 7, 2);
      board[7][5] = new Bishop('w', 7, 5);
      board[0][2] = new Bishop('b', 0, 2);
      board[0][5] = new Bishop('b', 0, 5);
      // Queens
      board[7][3] = new Queen('w', 7, 3);
      board[0][3] = new Queen('b', 0, 3);
      // Kings
      board[7][4] = new King('w', 7, 4);
      board[0][4] = new King('b', 0, 4);
      return board;
    }

    cloneBoard(board) {
      return board.map(row => row.map(piece => piece ? piece.clone() : null));
    }

    getKingPosition(board, color) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === color && p.type === 'k') return [r, c];
        }
      }
      return null;
    }

    isSquareAttacked(board, row, col, attackerColor) {
      // Pour chaque pièce adverse, voir si elle peut attaquer cette case
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === attackerColor) {
            let moves;
            if (p.type === 'k') {
              moves = p.getMoves(board, false, false);
            } else if (p.type === 'p') {
              // Pions attaquent en diagonale (différent de déplacement normal)
              const dir = p.color === 'w' ? -1 : 1;
              moves = [];
              for (const dc of [-1,1]) {
                const nr = r + dir;
                const nc = c + dc;
                if (nr === row && nc === col) {
                  moves.push([nr,nc]);
                }
              }
            } else {
              moves = p.getMoves(board);
            }
            for (const [mr, mc] of moves) {
              if (mr === row && mc === col) return true;
            }
          }
        }
      }
      return false;
    }

    isInCheck(board, color) {
      const kingPos = this.getKingPosition(board, color);
      if (!kingPos) return false;
      return this.isSquareAttacked(board, kingPos[0], kingPos[1], color === 'w' ? 'b' : 'w');
    }

    // Vérifie si un coup est légal: pas mettre son roi en échec
    isMoveLegal(fromR, fromC, toR, toC) {
      const piece = this.board[fromR][fromC];
      if (!piece || piece.color !== this.currentTurn) return false;

      // Le mouvement doit être dans la liste des mouvements possibles (hors check)
      let possibleMoves = this.getPieceMoves(piece, this.board);

      if (!possibleMoves.some(([r,c]) => r === toR && c === toC)) return false;

      // Simuler le coup pour vérifier si le roi n’est pas en échec
      const boardCopy = this.cloneBoard(this.board);
      this._makeMoveOnBoard(boardCopy, fromR, fromC, toR, toC);

      if (this.isInCheck(boardCopy, this.currentTurn)) return false;

      return true;
    }

    // Applique un coup sur un plateau donné (sans règles avancées comme promotion ou roque)
    _makeMoveOnBoard(board, fromR, fromC, toR, toC) {
      const p = board[fromR][fromC];
      if (!p) return;
      p.row = toR;
      p.col = toC;
      p.hasMoved = true;
      // prise en passant ?
      if (p.type === 'p' && this.enPassantTarget && toR === this.enPassantTarget[0] && toC === this.enPassantTarget[1]) {
        // Supprimer le pion pris en passant
        if (p.color === 'w') board[toR+1][toC] = null;
        else board[toR-1][toC] = null;
      }
      board[toR][toC] = p;
      board[fromR][fromC] = null;
      // Roque ? déplacer la tour
      if (p.type === 'k' && Math.abs(toC - fromC) === 2) {
        if (toC > fromC) {
          // Roque petit côté
          const rook = board[toR][7];
          board[toR][5] = rook;
          board[toR][7] = null;
          rook.col = 5;
          rook.hasMoved = true;
        } else {
          // Roque grand côté
          const rook = board[toR][0];
          board[toR][3] = rook;
          board[toR][0] = null;
          rook.col = 3;
          rook.hasMoved = true;
        }
      }
    }

    // Obtient les mouvements valides (hors check) d’une pièce, avec règles spéciales
    getPieceMoves(piece, board) {
      let moves;
      if (piece.type === 'k') {
        // Check droit au roque
        const canCastleKingside = this.canCastle(piece.color, 'kingside');
        const canCastleQueenside = this.canCastle(piece.color, 'queenside');
        moves = piece.getMoves(board, canCastleKingside, canCastleQueenside);
      } else if (piece.type === 'p') {
        moves = piece.getMoves(board, this.enPassantTarget);
      } else {
        moves = piece.getMoves(board);
      }
      // Filtrer les mouvements qui exposeraient le roi au check
      return moves.filter(([r,c]) => {
        const boardCopy = this.cloneBoard(board);
        this._makeMoveOnBoard(boardCopy, piece.row, piece.col, r, c);
        return !this.isInCheck(boardCopy, piece.color);
      });
    }

    canCastle(color, side) {
      if (this.isInCheck(this.board, color)) return false;
      const r = color === 'w' ? 7 : 0;
      if (side === 'kingside') {
        if (!this.castlingRights[color + 'K']) return false;
        // Cases vides entre roi et tour petit roque
        if (this.board[r][5] || this.board[r][6]) return false;
        // Cases pas attaquées
        if (this.isSquareAttacked(this.board, r, 5, color === 'w' ? 'b' : 'w')) return false;
        if (this.isSquareAttacked(this.board, r, 6, color === 'w' ? 'b' : 'w')) return false;
        return true;
      } else {
        if (!this.castlingRights[color + 'Q']) return false;
        if (this.board[r][1] || this.board[r][2] || this.board[r][3]) return false;
        if (this.isSquareAttacked(this.board, r, 3, color === 'w' ? 'b' : 'w')) return false;
        if (this.isSquareAttacked(this.board, r, 2, color === 'w' ? 'b' : 'w')) return false;
        return true;
      }
    }

    makeMove(fromR, fromC, toR, toC) {
      if (this.gameOver) return;
      if (!this.isMoveLegal(fromR, fromC, toR, toC)) return;
      const piece = this.board[fromR][fromC];

      // En passant capture
      let captured = null;
      if (piece.type === 'p' && this.enPassantTarget && toR === this.enPassantTarget[0] && toC === this.enPassantTarget[1]) {
        captured = this.currentTurn === 'w' ? this.board[toR+1][toC] : this.board[toR-1][toC];
        this.board[this.currentTurn === 'w' ? toR+1 : toR-1][toC] = null;
      } else {
        captured = this.board[toR][toC];
      }

      // Roque
      if (piece.type === 'k' && Math.abs(toC - fromC) === 2) {
        if (toC > fromC) {
          // Petit roque
          const rook = this.board[fromR][7];
          this.board[fromR][5] = rook;
          this.board[fromR][7] = null;
          rook.col = 5;
          rook.hasMoved = true;
        } else {
          // Grand roque
          const rook = this.board[fromR][0];
          this.board[fromR][3] = rook;
          this.board[fromR][0] = null;
          rook.col = 3;
          rook.hasMoved = true;
        }
      }

      // Déplacer la pièce
      this.board[toR][toC] = piece;
      this.board[fromR][fromC] = null;
      piece.row = toR;
      piece.col = toC;
      piece.hasMoved = true;

      // Mettre à jour les droits au roque si nécessaire
      if (piece.type === 'k') {
        this.castlingRights[this.currentTurn + 'K'] = false;
        this.castlingRights[this.currentTurn + 'Q'] = false;
      }
      if (piece.type === 'r') {
        if (fromC === 0) this.castlingRights[this.currentTurn + 'Q'] = false;
        else if (fromC === 7) this.castlingRights[this.currentTurn + 'K'] = false;
      }

      // Gestion de la promotion des pions
      if (piece.type === 'p' && (toR === 0 || toR === 7)) {
        this.promotePawn(piece);
      }

      // Gestion prise en passant
      this.enPassantTarget = null;
      if (piece.type === 'p' && Math.abs(toR - fromR) === 2) {
        this.enPassantTarget = [(fromR + toR) / 2, toC];
      }

      // Captures
      if (captured) {
        if (captured.color === 'w') this.capturedWhite.push(captured);
        else this.capturedBlack.push(captured);
      }

      this.moveHistory.push(this.notationMove(piece, fromR, fromC, toR, toC, captured));

      // Changement de joueur
      this.currentTurn = this.currentTurn === 'w' ? 'b' : 'w';

      this.updateStatus();
      this.render();

      // Vérifier échec et mat ou pat
      if (this.isInCheck(this.board, this.currentTurn)) {
        if (!this.hasAnyLegalMoves(this.currentTurn)) {
          this.statusElem.textContent = `Échec et mat, ${this.currentTurn === 'w' ? 'blancs' : 'noirs'} ont perdu.`;
          this.gameOver = true;
        } else {
          this.statusElem.textContent = `${this.currentTurn === 'w' ? 'Blancs' : 'Noirs'} sont en échec.`;
        }
      } else {
        if (!this.hasAnyLegalMoves(this.currentTurn)) {
          this.statusElem.textContent = "Pat ! Partie nulle.";
          this.gameOver = true;
        }
      }
    }

    promotePawn(pawn) {
      // Simple choix promotion en reine
      const color = pawn.color;
      const r = pawn.row;
      const c = pawn.col;
      this.board[r][c] = new Queen(color, r, c);
    }

    notationMove(piece, fromR, fromC, toR, toC, captured) {
      // Simple notation: e2-e4
      const cols = ['a','b','c','d','e','f','g','h'];
      const from = cols[fromC] + (8 - fromR);
      const to = cols[toC] + (8 - toR);
      let captureChar = captured ? 'x' : '-';
      return `${piece.type.toUpperCase()}${from}${captureChar}${to}`;
    }

    hasAnyLegalMoves(color) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = this.board[r][c];
          if (p && p.color === color) {
            const moves = this.getPieceMoves(p, this.board);
            if (moves.length > 0) return true;
          }
        }
      }
      return false;
    }

    render() {
      const boardDiv = document.getElementById('chessboard');
      boardDiv.innerHTML = '';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell ' + ((r + c) % 2 === 1 ? 'black' : 'white');
          cell.dataset.row = r;
          cell.dataset.col = c;
          const piece = this.board[r][c];
          if (piece) {
            const img = document.createElement('img');
            img.src = this.getPieceImage(piece);
            img.draggable = true;
            img.dataset.row = r;
            img.dataset.col = c;
            img.dataset.color = piece.color;
            img.dataset.type = piece.type;
            cell.appendChild(img);
          }
          boardDiv.appendChild(cell);
        }
      }
      this.updateCapturedPieces();
      this.updateMoveHistory();
    }

    getPieceImage(piece) {
        const baseUrl = 'pieces/';
        // Construire la clé comme dans ton boardState : ex 'wp', 'bk', etc.
        const key = piece.color + piece.type.toLowerCase();
        const images = {
            wp: 'wp.png',
            wr: 'wr.png',
            wn: 'wn.png',
            wb: 'wb.png',
            wq: 'wq.png',
            wk: 'wk.png',
            bp: 'bp.png',
            br: 'br.png',
            bn: 'bn.png',
            bb: 'bb.png',
            bq: 'bq.png',
            bk: 'bk.png'
        };
        return baseUrl + images[key];
        }


    updateCapturedPieces() {
      this.capturedWhiteElem.innerHTML = this.capturedWhite.map(p => {
        return `<img src="${this.getPieceImage(p)}" alt="${p.type}">`;
      }).join('');
      this.capturedBlackElem.innerHTML = this.capturedBlack.map(p => {
        return `<img src="${this.getPieceImage(p)}" alt="${p.type}">`;
      }).join('');
    }

    updateMoveHistory() {
      this.moveHistoryElem.innerHTML = this.moveHistory.map(m => `<li>${m}</li>`).join('');
    }

    updateStatus() {
      this.statusElem.textContent = this.gameOver ? 'Partie terminée.' : `Tour des ${this.currentTurn === 'w' ? 'Blancs' : 'Noirs'}`;
    }

    // Gestion du drag & drop
    addDragAndDropListeners() {
      const boardDiv = document.getElementById('chessboard');
      boardDiv.addEventListener('dragstart', e => {
        if (e.target.tagName === 'IMG') {
          const r = parseInt(e.target.dataset.row);
          const c = parseInt(e.target.dataset.col);
          const piece = this.board[r][c];
          if (piece && piece.color === this.currentTurn) {
            this.draggedPiece = piece;
            this.draggedFrom = [r, c];
          } else {
            e.preventDefault();
          }
        }
      });

      boardDiv.addEventListener('dragover', e => {
        e.preventDefault();
      });

      boardDiv.addEventListener('drop', e => {
        e.preventDefault();
        if (this.draggedPiece) {
          const target = e.target.closest('.cell');
          if (!target) return;
          const toR = parseInt(target.dataset.row);
          const toC = parseInt(target.dataset.col);
          const [fromR, fromC] = this.draggedFrom;
          this.makeMove(fromR, fromC, toR, toC);
          this.draggedPiece = null;
          this.draggedFrom = null;
        }
      });
    }

    // Gestion clic sur case pour déplacer pièces (clic sur pièce puis sur destination)
    addClickListeners() {
      const boardDiv = document.getElementById('chessboard');
      boardDiv.addEventListener('click', e => {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        const piece = this.board[r][c];

        if (this.selected) {
          const [sr, sc] = this.selected;
          if (this.isMoveLegal(sr, sc, r, c)) {
            this.makeMove(sr, sc, r, c);
            this.selected = null;
            this.render();
            return;
          }
          this.selected = null;
          this.render();
        }

        if (piece && piece.color === this.currentTurn) {
          this.selected = [r, c];
          this.highlightMoves(piece);
        }
      });
    }

    highlightMoves(piece) {
      this.render();
      const moves = this.getPieceMoves(piece, this.board);
      for (const [r, c] of moves) {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add('highlight');
      }
      const selCell = document.querySelector(`.cell[data-row="${piece.row}"][data-col="${piece.col}"]`);
      if (selCell) selCell.classList.add('selected');
    }

    start() {
      this.addDragAndDropListeners();
      this.addClickListeners();
      this.updateStatus();
    }
  }

  const game = new Game();
  game.start();