export function updateCastlingRights(board, selected, move, castling) {
    const piece = board[selected.row][selected.col];

    // Nếu vua di chuyển → mất quyền nhập thành
    if (piece === 'wk') castling.wl = castling.wr = false;
    if (piece === 'bk') castling.bl = castling.br = false;

    // Nếu xe di chuyển → mất quyền nhập thành bên trái/phải
    if (piece === 'wr') {
        if (selected.col === 0) castling.wl = false;
        if (selected.col === 7) castling.wr = false;
    }
    if (piece === 'br') {
        if (selected.col === 0) castling.bl = false;
        if (selected.col === 7) castling.br = false;
    }

    // Nếu xe bị ăn → mất quyền nhập thành tương ứng
    if (move?.isCapture) {
        const target = board[move.row][move.col];
        if (target === 'wr') {
            if (move.col === 0) castling.wl = false;
            if (move.col === 7) castling.wr = false;
        }
        if (target === 'br') {
            if (move.col === 0) castling.bl = false;
            if (move.col === 7) castling.br = false;
        }
    }
}

export function moveAPiece(board, newBoard, row, col, move, activePieces, newType) {
    if (newType) {
        // Di chuyển quân
        newBoard[move.row][move.col] = board[row][col][0]+newType;
        newBoard[row][col] = null;
    }
    else {
        // Di chuyển quân
        newBoard[move.row][move.col] = board[row][col];
        newBoard[row][col] = null;

        if (move?.isCastle) {
            const rookColFrom = (col === 2) ? 0 : 7;
            const rookColTo = (col === 2) ? 3 : 5;
            const rook = activePieces.find(p => p.row === row && p.col === rookColFrom && p.alive);
            rook.col = rookColTo;
    
            newBoard[row][rookColTo] = board[row][rookColFrom];
            newBoard[row][rookColFrom] = null;
        }
    }
}