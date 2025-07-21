let worker = null;

export function initWorker() {
  if (!worker) {
    worker = new Worker(new URL('./minimax.worker.js', import.meta.url), { type: 'module' });
  }
}

export function getBestMoveWithWorker(board, whitePieces, blackPieces, castlingRights, difficulty) {
  return new Promise((resolve) => {
    initWorker();
    worker.onmessage = (e) => {
      resolve(e.data); // { srcPiece, move }
    };
    worker.postMessage({board, whitePieces, blackPieces, castlingRights, difficulty});
  });
}