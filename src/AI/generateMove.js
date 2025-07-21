const direction = [ [-1, -1], [-1, 0], [-1,  1], [ 0, -1], [ 0,  1], [ 1, -1], [ 1,  0], [ 1, 1] ];

// Sinh nước đi cho quân Vua
export function generateKingMoves(board, row, col, color, getAllAttackedSquares, isKingInCheck, castlingRights, whitePieces, blackPieces) {    
    const moves = [];
    const opponent = color === 'w' ? 'b' : 'w';
    const attackedSquares = getAllAttackedSquares(board, opponent, whitePieces, blackPieces);

    for (const [dr, dc] of direction) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = board[r][c];
        if (!target) moves.push({ row: r, col: c, isCapture: false });
        else if (target[0] === opponent) moves.push({ row: r, col: c, isCapture: true });
    }

    // Nhập thành
    const isInCheck = isKingInCheck(board, color, whitePieces, blackPieces);
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