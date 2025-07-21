import { makeMinimaxMove } from "./minimax_AI";

self.onmessage = function (e) {
    const { board, whitePieces, blackPieces, castlingRights, difficulty } = e.data;

    const result = makeMinimaxMove(board, whitePieces, blackPieces, castlingRights, difficulty)

    self.postMessage(result)
}