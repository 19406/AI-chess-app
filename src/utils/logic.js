import { generateBishopCapture, generateKingCapture, generateKnightCapture, generatePawnCapture, generateQueenCapture, generateRookCapture } from "./generateCapture";
import { generateBishopMoves, generateKingMoves, generateKnightMoves, generatePawnMoves, generateQueenMoves, generateRookMoves } from "./generateMove";
import { moveAPiece, updateCastlingRights } from "./handleMove";
import { getBestMoveWithWorker } from "../AI/workerClient"

let whitePieces = [
    {type: 'p', row: 6, col: 0, alive: true}, // PAWN1
    {type: 'p', row: 6, col: 1, alive: true}, // PAWN2
    {type: 'p', row: 6, col: 2, alive: true}, // PAWN3
    {type: 'p', row: 6, col: 3, alive: true}, // PAWN4
    {type: 'p', row: 6, col: 4, alive: true}, // PAWN5
    {type: 'p', row: 6, col: 5, alive: true}, // PAWN6 
    {type: 'p', row: 6, col: 6, alive: true}, // PAWN7
    {type: 'p', row: 6, col: 7, alive: true}, // PAWN8
    {type: 'r', row: 7, col: 0, alive: true}, // ROOK1
    {type: 'n', row: 7, col: 1, alive: true}, // KNIGHT1
    {type: 'b', row: 7, col: 2, alive: true}, // BISHOP1
    {type: 'q', row: 7, col: 3, alive: true}, // QUEEN
    {type: 'k', row: 7, col: 4, alive: true}, // KING
    {type: 'b', row: 7, col: 5, alive: true}, // BISHOP2
    {type: 'n', row: 7, col: 6, alive: true}, // KNIGHT2
    {type: 'r', row: 7, col: 7, alive: true}  // ROOK2
];

let blackPieces = [
    {type: 'p', row: 1, col: 0, alive: true}, // PAWN1
    {type: 'p', row: 1, col: 1, alive: true}, // PAWN2
    {type: 'p', row: 1, col: 2, alive: true}, // PAWN3
    {type: 'p', row: 1, col: 3, alive: true}, // PAWN4
    {type: 'p', row: 1, col: 4, alive: true}, // PAWN5
    {type: 'p', row: 1, col: 5, alive: true}, // PAWN6 
    {type: 'p', row: 1, col: 6, alive: true}, // PAWN7
    {type: 'p', row: 1, col: 7, alive: true}, // PAWN8
    {type: 'r', row: 0, col: 0, alive: true}, // ROOK1
    {type: 'n', row: 0, col: 1, alive: true}, // KNIGHT1
    {type: 'b', row: 0, col: 2, alive: true}, // BISHOP1
    {type: 'q', row: 0, col: 3, alive: true}, // QUEEN
    {type: 'k', row: 0, col: 4, alive: true}, // KING
    {type: 'b', row: 0, col: 5, alive: true}, // BISHOP2
    {type: 'n', row: 0, col: 6, alive: true}, // KNIGHT2
    {type: 'r', row: 0, col: 7, alive: true}  // ROOK2
];

let castlingRights = {wl: true, wr: true, bl: true, br: true};

let boardState = [];

const clonePieces = pieces => pieces.map(p => ({ ...p }));

/*----------------------------------------------------------------------------------------------------*/

export function applyMove(board, move, selected, turn, newType) {
    const { row, col } = move;
    const isWhiteTurn = (turn === 'w');
    const activePieces = isWhiteTurn ? whitePieces : blackPieces;
    const opponentPieces = isWhiteTurn ? blackPieces : whitePieces;
    const castling = castlingRights;
    const selectedPiece = activePieces.find(p => p.row === selected.row && p.col === selected.col && p.alive);

    const newBoard = board.map(r => [...r]);

    // Thêm boardState vào history để theo dõi
    const cloneWhite = clonePieces(whitePieces);
    const cloneBlack = clonePieces(blackPieces);
    const cloneCastling = { ...castlingRights };

    const currentState = { white: cloneWhite, black: cloneBlack, castling: cloneCastling };
    boardState.push(currentState);

    // Ăn quân
    if (move?.isCapture) opponentPieces.find(p => p.row === row && p.col === col && p.alive).alive = false;

    // Cập nhật row, col cho quân đi
    selectedPiece.row = row;
    selectedPiece.col = col;

    if (newType) {
        // Cập nhật kiểu cho quân vừa phong cấp
        selectedPiece.type = newType;
        moveAPiece(board, newBoard, selected.row, selected.col, move, activePieces, newType);
    }
    else {
        moveAPiece(board, newBoard, selected.row, selected.col, move, activePieces);
        updateCastlingRights(board, selected, move, castling);
    }

    return { newBoard, currentState };
}

/*----------------------------------------------------------------------------------------------------*/

// Xác định nước đi hợp lệ
export function getPossibleMoves(row, col, piece, board) {
    const color = piece[0];
    let moves = [];

    if (piece[1] === 'p') moves = generatePawnMoves(board, row, col, color);
    if (piece[1] === 'r') moves = generateRookMoves(board, row, col, color);
    if (piece[1] === 'n') moves = generateKnightMoves(board, row, col, color);
    if (piece[1] === 'b') moves = generateBishopMoves(board, row, col, color);
    if (piece[1] === 'q') moves = generateQueenMoves(board, row, col, color);
    if (piece[1] === 'k') moves = generateKingMoves(board, row, col, color, getAllAttackedSquares, isKingInCheck, castlingRights);

    return filterLegalMoves(moves, row, col, board, color);
}

// Trả về các nước ăn quân
export function getPossibleCapture(row, col, piece, board) {
    const color = piece[0];

    if (piece[1] === 'p') return generatePawnCapture(row, col, color);
    if (piece[1] === 'r') return generateRookCapture(board, row, col);
    if (piece[1] === 'n') return generateKnightCapture(row, col);
    if (piece[1] === 'b') return generateBishopCapture(board, row, col);
    if (piece[1] === 'q') return generateQueenCapture(board, row, col);
    if (piece[1] === 'k') return generateKingCapture(row, col);
}

// Lọc lại nước đi khả thi để thoát chiếu
function filterLegalMoves (moves, row, col, board, color) {
    return moves.filter(move => {
        const simulatedWhite = clonePieces(whitePieces);
        const simulatedBlack = clonePieces(blackPieces);

        const isWhiteTurn = (color === 'w');
        const activePieces = isWhiteTurn ? simulatedWhite : simulatedBlack;
        const opponentPieces = isWhiteTurn ? simulatedBlack : simulatedWhite;

        const simulatedBoard = board.map(r => [...r]);

        if (move?.isCapture) opponentPieces.find((p) => p.row === move.row && p.col === move.col && p.alive).alive = false;

        moveAPiece(board, simulatedBoard, row, col, move, activePieces);

        // Cập nhật vị trí của quân vừa đi
        const movedPiece = activePieces.find(p => p.row === row && p.col === col && p.alive);
        movedPiece.row = move.row;
        movedPiece.col = move.col;

        // Tìm vị trí của quân Vua
        const king = activePieces.find(p => p.type === 'k');
        const kingRow = king.row;
        const kingCol = king.col;

        for (const piece of opponentPieces) {
            if (!piece.alive) continue;

            const pieceRow = piece.row;
            const pieceCol = piece.col;
            const capturePiece = simulatedBoard[pieceRow][pieceCol];

            const captures = getPossibleCapture(pieceRow, pieceCol, capturePiece, simulatedBoard)
            if (captures.some(p => p.row === kingRow && p.col === kingCol)) return false;
        }

        return true;
    });
}

// Kiểm tra tất cả các ô đang bị kiểm soát
function getAllAttackedSquares(board, enemyColor) {
    let attacked = [];
    const pieces = (enemyColor === 'w') ? whitePieces : blackPieces;

    for (const piece of pieces) {
        if (!piece.alive) continue;

        const pieceRow = piece.row;
        const pieceCol = piece.col;
        const capturePiece = board[pieceRow][pieceCol];

        attacked.push(...getPossibleCapture(pieceRow, pieceCol, capturePiece, board));
    }

    const uniqueAttacked = Array.from(
        new Map(attacked.map(sq => [`${sq.row},${sq.col}`, sq])).values()
    );

    return uniqueAttacked;
}

// Kiểm tra vua bị chiếu
export function isKingInCheck(board, color) {
    const opponentColor = (color === 'b') ? 'w' : 'b';
    const pieces = (color === 'w') ? whitePieces : blackPieces;

    const king = pieces.find(p => p.type === 'k' && p.alive);

    const { row, col } = king;
    const attackedSquares = getAllAttackedSquares(board, opponentColor);

    const isUnderAttack = attackedSquares.some(sq => sq.row === row && sq.col === col);

    return { isInCheck: isUnderAttack, position: { row, col } };
}

// Kiểm tra bàn cờ còn đủ quân để chơi tiếp hay không
function isInsufficientMaterial(pieces) {
    // Còn mỗi 2 Vua
    if (pieces.length === 2) return true;

    // Còn Vua và 1 bên còn 1 Tượng hoặc 1 Mã
    if (pieces.length === 3 && alivePieces.some(p => p.type === 'b' || p.type === 'n')) return true;

    //Còn Vua và 2 Tượng cùng màu ô
    if (pieces.length === 4 && pieces.filter(p => p.type === 'b').length === 2) {
        const bishops = pieces.filter(p => p.type === 'b');
        const firstBishop = (bishops[0].row + bishops[0].col);
        const secondBishop = (bishops[1].row + bishops[1].col);
        const sameColor = (firstBishop + secondBishop) % 2 === 0;
        
        if (sameColor) return true;
    }

    return false;
}

// Kiểm tra bàn cờ có bị lặp 3 lần không
function isThreefoldRepetition(currentState) {
    let count = 0;
    const currentStr = JSON.stringify(currentState);

    for (const state of boardState) {
        if (JSON.stringify(state) === currentStr) count++;
    }
    return count >= 3;
}

// Kiểm tra kết thúc ván đấu
export function checkGameEnd(board, turn, currentState) {
    const allPieces = [ ...whitePieces, ...blackPieces ];

    const opponentPieces = (turn === 'w') ? blackPieces.filter(p => p.alive) : whitePieces.filter(p => p.alive);
    const opponentColor = (turn === 'w') ? 'b' : 'w';

    const opponentKingIncheck = isKingInCheck(board, opponentColor).isInCheck;

    const hasLegalMoves = opponentPieces.some(p =>
        getPossibleMoves(p.row, p.col, board[p.row][p.col], board).length > 0);

    if (!hasLegalMoves) return opponentKingIncheck ? "checkmate" : "stalemate";

    const alivePieces = allPieces.filter(p => p.alive);
    
    if (isInsufficientMaterial(alivePieces)) return "insufficient material";
    if (isThreefoldRepetition(currentState)) return "threefold repetition";

    return "continue";
}

// Cập nhật trạng thái bàn cờ
export function updateBoardState(step) {
    const { white, black, castling } = boardState[boardState.length - step];
    whitePieces = white;
    blackPieces = black;
    castlingRights = castling;
    boardState = boardState.slice(0, boardState.length - step);
}

export function resetBoardState() {
    whitePieces = [
        {type: 'p', row: 6, col: 0, alive: true}, // PAWN1
        {type: 'p', row: 6, col: 1, alive: true}, // PAWN2
        {type: 'p', row: 6, col: 2, alive: true}, // PAWN3
        {type: 'p', row: 6, col: 3, alive: true}, // PAWN4
        {type: 'p', row: 6, col: 4, alive: true}, // PAWN5
        {type: 'p', row: 6, col: 5, alive: true}, // PAWN6 
        {type: 'p', row: 6, col: 6, alive: true}, // PAWN7
        {type: 'p', row: 6, col: 7, alive: true}, // PAWN8
        {type: 'r', row: 7, col: 0, alive: true}, // ROOK1
        {type: 'n', row: 7, col: 1, alive: true}, // KNIGHT1
        {type: 'b', row: 7, col: 2, alive: true}, // BISHOP1
        {type: 'q', row: 7, col: 3, alive: true}, // QUEEN
        {type: 'k', row: 7, col: 4, alive: true}, // KING
        {type: 'b', row: 7, col: 5, alive: true}, // BISHOP2
        {type: 'n', row: 7, col: 6, alive: true}, // KNIGHT2
        {type: 'r', row: 7, col: 7, alive: true}  // ROOK2
    ];
    
    blackPieces = [
        {type: 'p', row: 1, col: 0, alive: true}, // PAWN1
        {type: 'p', row: 1, col: 1, alive: true}, // PAWN2
        {type: 'p', row: 1, col: 2, alive: true}, // PAWN3
        {type: 'p', row: 1, col: 3, alive: true}, // PAWN4
        {type: 'p', row: 1, col: 4, alive: true}, // PAWN5
        {type: 'p', row: 1, col: 5, alive: true}, // PAWN6 
        {type: 'p', row: 1, col: 6, alive: true}, // PAWN7
        {type: 'p', row: 1, col: 7, alive: true}, // PAWN8
        {type: 'r', row: 0, col: 0, alive: true}, // ROOK1
        {type: 'n', row: 0, col: 1, alive: true}, // KNIGHT1
        {type: 'b', row: 0, col: 2, alive: true}, // BISHOP1
        {type: 'q', row: 0, col: 3, alive: true}, // QUEEN
        {type: 'k', row: 0, col: 4, alive: true}, // KING
        {type: 'b', row: 0, col: 5, alive: true}, // BISHOP2
        {type: 'n', row: 0, col: 6, alive: true}, // KNIGHT2
        {type: 'r', row: 0, col: 7, alive: true}  // ROOK2
    ];
    
    castlingRights = {wl: true, wr: true, bl: true, br: true};
    
    boardState = [];
}

export function handleAIMove(board, difficulty) {
    return getBestMoveWithWorker(board, whitePieces, blackPieces, castlingRights, difficulty);
}