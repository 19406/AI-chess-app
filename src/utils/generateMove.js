const directions = {
    r: [ [-1,  0], [ 1, 0], [ 0, -1], [ 0,  1] ],
    n: [ [-2, -1], [-2, 1], [-1, -2], [-1,  2], [ 1, -2], [ 1,  2], [ 2, -1], [ 2, 1] ],
    b: [ [-1, -1], [-1, 1], [ 1, -1], [ 1,  1] ],
    q: [ [-1,  0], [ 1, 0], [ 0, -1], [ 0,  1], [-1, -1], [-1,  1], [ 1, -1], [ 1, 1] ], 
    k: [ [-1, -1], [-1, 0], [-1,  1], [ 0, -1], [ 0,  1], [ 1, -1], [ 1,  0], [ 1, 1] ]
}

// Sinh nước đi cho quân Tốt
export function generatePawnMoves(board, row, col, color) {
    const moves = [];
    const direction = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;
    const opponent = color === "w" ? "b" : "w";

    // Tiến 1 ô
    if (board[row + direction]?.[col] == null) {
        moves.push({ row: row + direction, col, isCapture: false });
        // Tiến 2 ô nếu ở hàng bắt đầu
        if (row === startRow && board[row + 2 * direction]?.[col] == null) moves.push({ row: row + 2 * direction, col, isCapture: false });
    }

    // Ăn chéo trái
    if (col > 0 && board[row + direction]?.[col - 1]?.[0] === opponent) moves.push({ row: row + direction, col: col - 1, isCapture: true });
    // Ăn chéo phải
    if (col < 7 && board[row + direction]?.[col + 1]?.[0] === opponent) moves.push({ row: row + direction, col: col + 1, isCapture: true });

    return moves;
}

// Sinh nước đi cho quân Xe
export function generateRookMoves(board, row, col, color) {
    const moves = [];
    const opponent = color === 'w' ? 'b' : 'w';

    for (const [dr, dc] of directions.r) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const target = board[r][c];
            if (!target) moves.push({ row: r, col: c, isCapture: false });
            else {
                if (target[0] === opponent) moves.push({ row: r, col: c, isCapture: true });
                break;
            }
            r += dr;
            c += dc;
        }
    }

    return moves;
}

// Sinh nước đi cho quân Mã
export function generateKnightMoves(board, row, col, color) {
    const moves = [];
    const opponent = color === 'w' ? 'b' : 'w';

    for (const [dr, dc] of directions.n) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = board[r][c];
        if (!target) moves.push({ row: r, col: c, isCapture: false });
        else if (target[0] === opponent) moves.push({ row: r, col: c, isCapture: true });
    }

    return moves;
}

// Sinh nước đi cho quân Tượng
export function generateBishopMoves(board, row, col, color) {
    const moves = [];
    const opponent = color === 'w' ? 'b' : 'w';

    for (const [dr, dc] of directions.b) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const target = board[r][c];
            if (!target) moves.push({ row: r, col: c, isCapture: false });
            else {
                if (target[0] === opponent) moves.push({ row: r, col: c, isCapture: true });
                break;
            }
            r += dr;
            c += dc;
        }
    }

    return moves;
}

// Sinh nước đi cho quân Hậu
export function generateQueenMoves(board, row, col, color) {
    const moves = [];
    const opponent = color === 'w' ? 'b' : 'w';

    for (const [dr, dc] of directions.q) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const target = board[r][c];
            if (!target) moves.push({ row: r, col: c, isCapture: false });
            else {
                if (target[0] === opponent) moves.push({ row: r, col: c, isCapture: true });
                break;
            }
            r += dr;
            c += dc;
        }
    }

    return moves;
}

// Sinh nước đi cho quân Vua
export function generateKingMoves(board, row, col, color, getAllAttackedSquares, isKingInCheck, castlingRights) {    
    const moves = [];
    const opponent = color === 'w' ? 'b' : 'w';
    const attackedSquares = getAllAttackedSquares(board, opponent);

    for (const [dr, dc] of directions.k) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = board[r][c];

        if (!target) moves.push({ row: r, col: c, isCapture: false });
        else if (target[0] === opponent) moves.push({ row: r, col: c, isCapture: true });
    }

    // Nhập thành
    const isInCheck = isKingInCheck(board, color).isInCheck;
    const lcastling = (color === 'w') ? castlingRights.wl : castlingRights.bl;
    const rcastling = (color === 'w') ? castlingRights.wr : castlingRights.br;
    const rank = color === 'w' ? 7 : 0;

    if (!isInCheck) {
        if (
            lcastling &&
            board[rank][1] === null &&
            board[rank][2] === null &&
            board[rank][3] === null &&
            !attackedSquares.some(sq => sq.row === rank && [1, 2, 3].includes(sq.col))
        ) moves.push({ row: rank, col: 2, isCastle: true });

        else if (
            rcastling &&
            board[rank][5] === null &&
            board[rank][6] === null &&
            !attackedSquares.some(sq => sq.row === rank && [5, 6].includes(sq.col))
        ) moves.push({ row: rank, col: 6, isCastle: true });
    }

    return moves;
}