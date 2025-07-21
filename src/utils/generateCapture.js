const directions = {
    r: [ [-1,  0], [ 1, 0], [ 0, -1], [ 0,  1] ],
    n: [ [-2, -1], [-2, 1], [-1, -2], [-1,  2], [ 1, -2], [ 1,  2], [ 2, -1], [ 2, 1] ],
    b: [ [-1, -1], [-1, 1], [ 1, -1], [ 1,  1] ],
    q: [ [-1,  0], [ 1, 0], [ 0, -1], [ 0,  1], [-1, -1], [-1,  1], [ 1, -1], [ 1, 1] ], 
    k: [ [-1, -1], [-1, 0], [-1,  1], [ 0, -1], [ 0,  1], [ 1, -1], [ 1,  0], [ 1, 1] ]
}

// Sinh nước ăn quân của quân Tốt
export function generatePawnCapture(row, col, color) {
    const moves = [];
    const direction = color === "w" ? -1 : 1;

    // Ăn chéo trái
    if(col > 0) moves.push({ row: row + direction, col: col - 1 });
    // Ăn chéo phải
    if(col < 7) moves.push({ row: row + direction, col: col + 1 });

    return moves;
}

// Sinh nước ăn quân cho quân Xe
export function generateRookCapture(board, row, col) {
    const moves = [];

    for (const [dr, dc] of directions.r) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const target = board[r][c];
            moves.push({ row: r, col: c });
            if (target) break
            r += dr;
            c += dc;
        }
    }

    return moves;
}

// Sinh nước đi cho quân Mã
export function generateKnightCapture(row, col) {
    const moves = [];

    for (const [dr, dc] of directions.n) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;
        moves.push({ row: r, col: c });
    }

    return moves;
}

// Sinh nước ăn quân cho quân Tượng
export function generateBishopCapture(board, row, col) {
    const moves = [];

    for (const [dr, dc] of directions.b) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const target = board[r][c];
            moves.push({ row: r, col: c });
            if (target) break;
            r += dr;
            c += dc;
        }
    }

    return moves;
}

// Sinh nước ăn quân cho quân Hậu
export function generateQueenCapture(board, row, col) {
    const moves = [];

    for (const [dr, dc] of directions.q) {
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const target = board[r][c];
            moves.push({ row: r, col: c });
            if (target) break;
            r += dr;
            c += dc;
        }
    }

    return moves;
}

// Sinh nước ăn quân cho quân Vua
export function generateKingCapture(row, col) {
    const moves = [];

    for (const [dr, dc] of directions.k) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r > 7 || c < 0 || c > 7) continue;
        moves.push({ row: r, col: c });
    }

    return moves;
}