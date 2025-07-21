import { getPossibleCapture } from "../utils/logic";
import { generateBishopMoves, generateKnightMoves, generatePawnMoves, generateQueenMoves, generateRookMoves } from "../utils/generateMove";
import { generateKingMoves } from "./generateMove"
import { moveAPiece, updateCastlingRights } from "../utils/handleMove";

const pieceValues = {
    'p': 1,
    'n': 3,
    'b': 3,
    'r': 5,
    'q': 9,
    'k': 0,
};

const whitePosScores = {
    'n': [
        [0.0,  0.1,  0.2,  0.2,  0.2,  0.2,  0.1, 0.0],
        [0.1,  0.3,  0.5,  0.5,  0.5,  0.5,  0.3, 0.1],
        [0.2,  0.5,  0.6, 0.65, 0.65,  0.6,  0.5, 0.2],
        [0.2, 0.55, 0.65,  0.7,  0.7, 0.65, 0.55, 0.2],
        [0.2,  0.5, 0.65,  0.7,  0.7, 0.65,  0.5, 0.2],
        [0.2, 0.55,  0.6, 0.65, 0.65,  0.6, 0.55, 0.2],
        [0.1,  0.3,  0.5, 0.55, 0.55,  0.5,  0.3, 0.1],
        [0.0,  0.1,  0.2,  0.2,  0.2,  0.2,  0.1, 0.0]
    ],

    'b': [
        [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.0],
        [0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2],
        [0.2, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.2],
        [0.2, 0.5, 0.5, 0.6, 0.6, 0.5, 0.5, 0.2],
        [0.2, 0.4, 0.6, 0.6, 0.6, 0.6, 0.4, 0.2],
        [0.2, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.2],
        [0.2, 0.5, 0.4, 0.4, 0.4, 0.4, 0.5, 0.2],
        [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.0]
    ],

    'r': [
        [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
        [ 0.5, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75,  0.5],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [0.25, 0.25, 0.25,  0.5,  0.5, 0.25, 0.25, 0.25]
    ],

    'q': [
        [0.0, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.0],
        [0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2],
        [0.2, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2],
        [0.3, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3],
        [0.4, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3],
        [0.2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2],
        [0.2, 0.4, 0.5, 0.4, 0.4, 0.4, 0.4, 0.2],
        [0.0, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.0]
    ],

    'p': [
        [ 0.8,  0.8, 0.8,  0.8,  0.8, 0.8,  0.8,  0.8],
        [ 0.7,  0.7, 0.7,  0.7,  0.7, 0.7,  0.7,  0.7],
        [ 0.3,  0.3, 0.4,  0.5,  0.5, 0.4,  0.3,  0.3],
        [0.25, 0.25, 0.3, 0.45, 0.45, 0.3, 0.25, 0.25],
        [ 0.2,  0.2, 0.2,  0.4,  0.4, 0.2,  0.2,  0.2],
        [0.25, 0.15, 0.1,  0.2,  0.2, 0.1, 0.15, 0.25],
        [0.25,  0.3, 0.3,  0.0,  0.0, 0.3,  0.3, 0.25],
        [ 0.2,  0.2, 0.2,  0.2,  0.2, 0.2,  0.2,  0.2]
    ],

    'k': [
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.3, 0.4, 0.2, 0.1, 0.1, 0.2, 0.4, 0.3],
        [0.5, 0.6, 0.3, 0.2, 0.2, 0.3, 0.6, 0.5],
        [0.8, 1.0, 0.8, 0.6, 0.6, 0.8, 1.0, 0.8]
    ]
}

const blackPosScores = {
    'n': [
        [0.0,  0.1,  0.2,  0.2,  0.2,  0.2,  0.1, 0.0],
        [0.1,  0.3,  0.5, 0.55, 0.55,  0.5,  0.3, 0.1],
        [0.2, 0.55,  0.6, 0.65, 0.65,  0.6, 0.55, 0.2],
        [0.2,  0.5, 0.65,  0.7,  0.7, 0.65,  0.5, 0.2],
        [0.2, 0.55, 0.65,  0.7,  0.7, 0.65, 0.55, 0.2],
        [0.2,  0.5,  0.6, 0.65, 0.65,  0.6,  0.5, 0.2],
        [0.1,  0.3,  0.5,  0.5,  0.5,  0.5,  0.3, 0.1],
        [0.0,  0.1,  0.2,  0.2,  0.2,  0.2,  0.1, 0.0]
    ],

    'b': [
        [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.0],
        [0.2, 0.5, 0.4, 0.4, 0.4, 0.4, 0.5, 0.2],
        [0.2, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.2],
        [0.2, 0.4, 0.6, 0.6, 0.6, 0.6, 0.4, 0.2],
        [0.2, 0.5, 0.5, 0.6, 0.6, 0.5, 0.5, 0.2],
        [0.2, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.2],
        [0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2],
        [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.0]
    ],

    'r': [
        [0.25, 0.25, 0.25,  0.5,  0.5, 0.25, 0.25, 0.25],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,  0.0],
        [ 0.5, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75,  0.5],
        [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]
    ],

    'q': [
        [0.0, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.0],
        [0.2, 0.4, 0.5, 0.4, 0.4, 0.4, 0.4, 0.2],
        [0.2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2],
        [0.4, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3],
        [0.3, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3],
        [0.2, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2],
        [0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2],
        [0.0, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.0]
    ],

    'p': [
        [ 0.2,  0.2, 0.2,  0.2,  0.2, 0.2,  0.2,  0.2],
        [0.25,  0.3, 0.3,  0.0,  0.0, 0.3,  0.3, 0.25],
        [0.25, 0.15, 0.1,  0.2,  0.2, 0.1, 0.15, 0.25],
        [ 0.2,  0.2, 0.2,  0.4,  0.4, 0.2,  0.2,  0.2],
        [0.25, 0.25, 0.3, 0.45, 0.45, 0.3, 0.25, 0.25],
        [ 0.3,  0.3, 0.4,  0.5,  0.5, 0.4,  0.3,  0.3],
        [ 0.7,  0.7, 0.7,  0.7,  0.7, 0.7,  0.7,  0.7],
        [ 0.8,  0.8, 0.8,  0.8,  0.8, 0.8,  0.8,  0.8]
    ],

    'k': [
        [0.8, 1.0, 0.8, 0.6, 0.6, 0.8, 1.0, 0.8],
        [0.5, 0.6, 0.3, 0.2, 0.2, 0.3, 0.6, 0.5],
        [0.3, 0.4, 0.2, 0.1, 0.1, 0.2, 0.4, 0.3],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2],
        [0.2, 0.3, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2]
    ]
}

const clonePieces = pieces => pieces.map(p => ({ ...p }));

/*----------------------------------------------------------------------------------------------------*/

function getPossibleMoves(row, col, piece, board, whitePieces, blackPieces, castlingRights) {
    const color = piece[0];
    let moves = [];
    
    if (piece[1] === 'p') moves = generatePawnMoves(board, row, col, color);
    if (piece[1] === 'r') moves = generateRookMoves(board, row, col, color);
    if (piece[1] === 'n') moves = generateKnightMoves(board, row, col, color);
    if (piece[1] === 'b') moves = generateBishopMoves(board, row, col, color);
    if (piece[1] === 'q') moves = generateQueenMoves(board, row, col, color);
    if (piece[1] === 'k') moves = generateKingMoves(board, row, col, color, getAllAttackedSquares, isKingInCheck, castlingRights, whitePieces, blackPieces);

    return filterLegalMoves(moves, row, col, board, color, whitePieces, blackPieces);
}

function filterLegalMoves (moves, row, col, board, color, whitePieces, blackPieces) {   
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

function getAllAttackedSquares(board, enemyColor, whitePieces, blackPieces) {
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

function isKingInCheck(board, color, whitePieces, blackPieces) {
    const opponentColor = (color === 'b') ? 'w' : 'b';
    const pieces = (color === 'w') ? whitePieces : blackPieces;

    const king = pieces.find(p => p.type === 'k' && p.alive);

    const { row, col } = king;
    const attackedSquares = getAllAttackedSquares(board, opponentColor, whitePieces, blackPieces);

    const isUnderAttack = attackedSquares.some(sq => sq.row === row && sq.col === col);

    return isUnderAttack;
}

function isCheckMate(board, turn, whitePieces, blackPieces, castlingRights) {
    const isWhiteTurn = turn === "w";
    const opponentPiece = isWhiteTurn ? blackPieces.filter(p => p.alive) : whitePieces.filter(p => p.alive);
    const opponentColor = isWhiteTurn ? 'b' : 'w';

    const opponentKingIncheck = isKingInCheck(board, opponentColor, whitePieces, blackPieces);

    const hasLegalMoves = opponentPiece.some(p => getPossibleMoves(p.row, p.col, board[p.row][p.col], board, whitePieces, blackPieces, castlingRights).length > 0);

    if (!hasLegalMoves) return opponentKingIncheck ? (turn === "w" ? -1000 : 1000) : 0;
    return 0;
}

function evaluateBoard(board, turn, whitePieces, blackPieces, castlingRights) {
    const mateScore = isCheckMate(board, turn, whitePieces, blackPieces, castlingRights);
    if (mateScore !== 0) return mateScore;

    let score = 0;

    const evaluateSide = (pieces, isWhite) => {
        for (const p of pieces) {
            if (!p.alive) continue;
            const value = pieceValues[p.type];
            const posScore = isWhite ? whitePosScores[p.type][p.row][p.col]
                                     : blackPosScores[p.type][p.row][p.col];
            score += (isWhite ? -1 : 1) * (value + posScore);
        }
    };

    evaluateSide(whitePieces, true);
    evaluateSide(blackPieces, false);

    return Math.round(score * 1000);
}

function generateLegalMoves(board, whitePieces, blackPieces, castlingRights, turn) {
    const MovesList = [];

    const isWhiteTurn = (turn === 'w');
    const activePieces = isWhiteTurn ? whitePieces : blackPieces;
    const alivePieces = activePieces.filter(p => p.alive);

    for (const piece of alivePieces) {
        const pieceRow = piece.row;
        const pieceCol = piece.col;
        const selectedPiece = board[pieceRow][pieceCol];
        const moves = getPossibleMoves(pieceRow, pieceCol, selectedPiece, board, whitePieces, blackPieces, castlingRights)

        for (const move of moves) MovesList.push({frow: pieceRow, fcol: pieceCol, move: move});
    }

    return MovesList;
}

function sortMoves(moves, board) {
    const pieceValues = {
        'p': 1,
        'n': 3,
        'b': 3,
        'r': 5,
        'q': 9,
        'k': 1000
    };

    function moveScore(move) {
        const { frow, fcol, move: tmove } = move;
        const fromPiece = board[frow][fcol];
        const toPiece = board[tmove.row][tmove.col];

        let score = 0;

        // Ưu tiên ăn quân
        if (toPiece) {
            const fromValue = pieceValues[fromPiece[1]];
            const toValue = pieceValues[toPiece[1]];

            // Bắt quân càng lớn thì càng tốt
            score += 10 * toValue - fromValue;
        }

        // Ưu tiên phong hậu
        if (fromPiece[1] === 'p' && (tmove.row === 0 || tmove.row === 7)) score += 90;

        // Ưu tiên đi vào trung tâm
        const centerSquares = [
            [3, 3], [3, 4], [4, 3], [4, 4]
        ];
        for (const [r, c] of centerSquares) {
            if (tmove.row === r && tmove.col === c) {
                score += 3;
                break;
            }
        }

        // Ưu tiên nước đi của quân giá trị thấp
        score -= pieceValues[fromPiece[1]] * 0.1;

        return score;
    }

    // Sắp xếp giảm dần theo điểm đánh giá nước đi
    return moves.sort((a, b) => moveScore(b) - moveScore(a));
}

function applyMove(board, move, selected, turn, whitePieces, blackPieces, castlingRights, newType) {
    const newBoard = board.map(r => [...r]);
    
    const cloneWhite = clonePieces(whitePieces);
    const cloneBlack = clonePieces(blackPieces);
    const cloneCastling = { ...castlingRights };
    
    const { row, col } = move;
    const isWhiteTurn = (turn === 'w');
    const activePieces = isWhiteTurn ? cloneWhite : cloneBlack;
    const opponentPieces = isWhiteTurn ? cloneBlack : cloneWhite;
    const castling = cloneCastling;
    const selectedPiece = activePieces.find(p => p.row === selected.row && p.col === selected.col && p.alive);

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

    return { newBoard, cloneWhite, cloneBlack, castling};
}

function minimax(board, whitePieces, blackPieces, castlingRights, depth, alpha, beta, maximizingPlayer, turn) {

    if (depth === 0) return { score: evaluateBoard(board, turn, whitePieces, blackPieces, castlingRights), move: null };

    const moves = generateLegalMoves(board, whitePieces, blackPieces, castlingRights, turn);
    const orderedMoves = sortMoves(moves, board).slice(0, 20);

    let bestMove = [];

    if (maximizingPlayer) {
        let maxEval = -Infinity;

        if (moves.length === 0) return { score: -Infinity, move: null };

        for (const move of orderedMoves) {
            let newType = null;
            const frow = move.frow;
            const fcol = move.fcol;
            const trow = move.move.row;
            const selected = { row: frow, col: fcol };
            if (board[frow][fcol][1] === 'p' && (trow === 0 || trow === 7)) newType = 'q';
            const { newBoard, cloneWhite, cloneBlack, castling } = applyMove(board, move.move, selected, turn, whitePieces, blackPieces, castlingRights, newType);
            const { score } = minimax(newBoard, cloneWhite, cloneBlack, castling, depth-1, alpha, beta, false, 'w');

            if (score > maxEval) {
                maxEval = score;
                bestMove = [move];
            } else if (score === maxEval) {
                bestMove.push(move);
            }
            alpha = Math.max(alpha, score);

            if (beta <= alpha) break;
        }

        const chosenMove = bestMove[Math.floor(Math.random() * bestMove.length)];

        return { score: maxEval, move: chosenMove };
    } else {
        let minEval = Infinity;

        if (moves.length === 0) return { score: Infinity, move: null };

        for (const move of orderedMoves) {
            let newType = null;
            const frow = move.frow;
            const fcol = move.fcol;
            const trow = move.move.row;
            const selected = { row: frow, col: fcol };
            if (board[frow][fcol][1] === 'p' && (trow === 0 || trow === 7)) newType = 'q';
            const { newBoard, cloneWhite, cloneBlack, castling } = applyMove(board, move.move, selected, turn, whitePieces, blackPieces, castlingRights, newType);
            const { score } = minimax(newBoard, cloneWhite, cloneBlack, castling, depth-1, alpha, beta, true, 'b');
        
            if (score < minEval) {
                minEval = score;
                bestMove = [move];
            } else if (score === minEval) {
                bestMove.push(move);
            }
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }

        const chosenMove = bestMove[Math.floor(Math.random() * bestMove.length)];

        return { score: minEval, move: chosenMove };        
    }
}

export function makeMinimaxMove(board, whitePieces, blackPieces, castlingRights, difficulty) {

    let depth = 0;
    if (difficulty === "easy") depth = 2;
    if (difficulty === "medium") depth = 3;
    if (difficulty === "hard") depth = 4;

    const { move } = minimax(board, whitePieces, blackPieces, castlingRights, depth, -Infinity, Infinity, true, 'b');

    const row = move.frow;
    const col = move.fcol;

    const piece = blackPieces.find(p => p.row === row && p.col === col );

    return { srcPiece: piece, move: move.move };
}