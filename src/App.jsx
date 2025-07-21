import { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Modal } from 'antd'
import { ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import Square from './components/Square';
import { TurnIndicator, renderPieceImage } from './components/Square';
import { getPossibleMoves, applyMove, isKingInCheck, checkGameEnd, resetBoardState, updateBoardState } from './utils/logic'
import { handleAIMove } from './utils/logic';

import './App.css'

const initialBoard = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

function App() {

  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState("w");

  const [isGameOver, setIsGameOver] = useState(false);
  const [result, setResult] = useState("");

  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastMove, setLastMove] = useState({ from: null, to: null });

  const [difficulty, setDifficulty] = useState("medium");
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);


  const [promotion, setPromotion] = useState(null);

  const historyRef = useRef(history);
  const turnRef = useRef(turn);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [inCheck, setInCheck] = useState({
    white: { isInCheck: false , position: {row: 7, col: 4} },
    black: { isInCheck: false , position: {row: 0, col: 4} }
  });

  useEffect(() => {
    const checkKingInCheck = () => {

      const whiteCheckMate = isKingInCheck(board, 'w');
      const blackCheckMate = isKingInCheck(board, 'b');
  
      setInCheck({
        white: whiteCheckMate,
        black: blackCheckMate
      });
    };
  
    checkKingInCheck();
  }, [board]);
  
  useEffect(() => {
    if (turn === 'b') {
      const timer = setTimeout(async () => {
        if (!isGameOver) {
          const { srcPiece, move } = await handleAIMove(board, difficulty);
          makeMove(move, srcPiece);
        }
      }, 500);
  
      return () => clearTimeout(timer);
    }
  }, [turn, isGameOver]);

  function makeMove(move, selected) {
    // Thêm board hiện tại vào history
    setHistory(prev => [...prev, board.map(r => [...r])]);

    const { row, col } = move;

    // Set nước đi cuối cùng
    setLastMove({ from: {row: selected.row, col: selected.col}, to: {row: row, col: col} });

    let applied = null;

    // Áp dụng nước đi
    if (board[selected.row][selected.col][1] === 'p' && (row === 0 || row === 7)) {
      applied = applyMove(board, move, selected, turn, 'q');
    }
    else applied = applyMove(board, move, selected, turn);

    const { newBoard, currentState } = applied;

    setBoard(newBoard);
    setTurn(turn === "w" ? "b" : "w");

    const gameState = checkGameEnd(newBoard, turn, currentState);
    if (gameState === "checkmate") {
        const winner = turn === 'w' ? "TRẮNG" : "ĐEN";
        const loser = turn === 'w' ? "ĐEN" : "TRẮNG";
        setResult(winner + " thắng - " + loser + " thua");
        setIsGameOver(true);
    } else if (gameState === "stalemate") {
        setResult("Hoà do hết nước đi");
        setIsGameOver(true);
    } else if (gameState === "insufficient material") {
        setResult("Hoà do không đủ quân");
        setIsGameOver(true);
    } else if (gameState === "threefold repetition") {
        setResult("Hoà do bàn cờ bị lặp 3 lần");
        setIsGameOver(true);
    }
  }

  const rows = board.map((r, row) => (
    <Row key={row} gutter={0}>
      {r.map((piece, col) => {
        const isBlack = (row + col) % 2 === 1;
        const isSelected = selected && selected.row === row && selected.col === col;
        
        const isLastMove =
          (lastMove.from && lastMove.from.row === row && lastMove.from.col === col) ||
          (lastMove.to && lastMove.to.row === row && lastMove.to.col === col)

        const move = possibleMoves.find(m => m.row === row && m.col === col);

        return (
          <Col key={`${row}-${col}`}>
            <Square
              isBlack={isBlack}
              piece={piece}
              isSelected={isSelected}
              isHighlighted={!!move && !move.isCapture}
              isCapture={!!move && move.isCapture}
              isLastMove={isLastMove}
              onClick={() => {handleClick(row, col)}}
              isInCheck={
                         ((inCheck.white.isInCheck && inCheck.white.position.row === row && inCheck.white.position.col === col) ||
                         (inCheck.black.isInCheck && inCheck.black.position.row === row && inCheck.black.position.col === col))
                        }
            />
          </Col>
        );
      })}
    </Row>
  ));

  function chooseDifficulty(level) {
    setDifficulty(level);
    setShowDifficultyModal(false);
  }  

  function handleRestart() {
    Modal.confirm({
      title: "Bạn có chắc muốn chơi lại?",
      content: 'Ván cũ sẽ bị xóa và bắt đầu lại từ đầu.',
      okText: 'Chơi lại',
      cancelText: 'Hủy',
      onOk: () => {
        resetGame();
        setShowDifficultyModal(true);
      }
    });
  }  

  function resetGame() {
    setBoard(initialBoard);
    setTurn("w");
  
    setIsGameOver(false);
    setResult("");
  
    setSelected(null);
    setPossibleMoves([]);
    setHistory([]);
    setLastMove({ from: null, to: null });
    resetBoardState();
  }

  // Xử lý click chuột
  function handleClick(row, col, newType) {
    const clickedPiece = board[row][col];

    if (!selected && (!clickedPiece || (clickedPiece[0] !== turn))) return;

    if (!selected) {
      if (clickedPiece) {
          setSelected({ row, col });
          let moves = [];

          moves = getPossibleMoves(row, col, clickedPiece, board);
          setPossibleMoves(moves);
      }
    } else {
      const move = possibleMoves.find(m => m.row === row && m.col === col);

      if (move) {
        // Thêm board hiện tại vào history
        setHistory(prev => [...prev, board.map(r => [...r])]);

        // Set nước đi cuối cùng
        setLastMove({ from: {row: selected.row, col: selected.col}, to: {row: row, col: col} });

        if (board[selected.row][selected.col][1] === 'p' && (row === 0 || row === 7) && promotion === null) {
          const piece = board[selected.row][selected.col];
          setPromotion({row: row, col: col, color: piece[0]});
          return;
        }
        
        // Áp dụng nước đi
        const { newBoard, currentState } = applyMove(board, move, selected, turn, newType)

        setBoard(newBoard);
        setTurn(turn === "w" ? "b" : "w");

        const gameState = checkGameEnd(newBoard, turn, currentState);
        if (gameState === "checkmate") {
            const winner = turn === 'w' ? "TRẮNG" : "ĐEN";
            const loser = turn === 'w' ? "ĐEN" : "TRẮNG";
            setResult(winner + " thắng - " + loser + " thua");
            setIsGameOver(true);
        } else if (gameState === "stalemate") {
            setResult("Hoà do hết nước đi");
            setIsGameOver(true);
        } else if (gameState === "insufficient material") {
            setResult("Hoà do không đủ quân");
            setIsGameOver(true);
        } else if (gameState === "threefold repetition") {
            setResult("Hoà do bàn cờ bị lặp 3 lần");
            setIsGameOver(true);
        }
        // Reset sau khi đi
        setSelected(null);
        setPossibleMoves([]);
      }
      else if (clickedPiece && clickedPiece[0] === turn) {
        setSelected({ row, col }); // chọn quân
        let moves = [];
        moves = getPossibleMoves(row, col, clickedPiece, board);
        setPossibleMoves(moves);
      } else {
        // Reset sau khi huỷ chọn
        setSelected(null);
        setPossibleMoves([]);
      }
    }
  };

  // Xử lý undo
  function handleUndo() {
    const currentHistory = historyRef.current;
    const currentTurn = turnRef.current;
    if (currentHistory.length === 0) return;

    const step = (currentHistory.length === 1) ? 1 : 2;
    const newTurn = (currentTurn === "w") ? (step === 1 ? "b" : "w") : (step === 1 ? "w" : "b");

    const previous = currentHistory[currentHistory.length - step];
    setBoard(previous);
    setHistory(prev => prev.slice(0, prev.length - step));
    setTurn(newTurn);

    updateBoardState(step);

    setSelected(null);
    setPossibleMoves([]);
    setLastMove({ from: null, to: null });
  };

  return (
    <>
    <div className="background">
      <div className="container">
        <TurnIndicator turn={turn} />
        {difficulty && (
          <div style={{
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#822',
            marginTop: '10px',
            marginBottom: '5px'
          }}>
            Độ khó: {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </div>
        )}
        <div className="chessboard">{rows}</div>
        <Button className="undobutton" onClick={() => handleUndo()}>
          Nếu bạn thấy mình chơi ngu và chưa muốn thua, hãy nhấn vào đây
        </Button>
        <Modal
          title="Chọn độ khó"
          open={showDifficultyModal}
          onCancel={() => setShowDifficultyModal(false)}
          footer={null}
          closable={false}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button type={difficulty === "easy" ? "primary" : "default"} onClick={() => chooseDifficulty("easy")}>Dễ</Button>
            <Button type={difficulty === "medium" ? "primary" : "default"} onClick={() => chooseDifficulty("medium")}>Trung bình</Button>
            <Button type={difficulty === "hard" ? "primary" : "default"} onClick={() => chooseDifficulty("hard")}>Khó</Button>
          </div>
        </Modal>
        <Modal
          open={!!promotion}
          title="Chọn quân để phong cấp"
          onCancel={() => setPromotion(null)}
          footer={null}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '10px' }}>
            {['q', 'r', 'b', 'n'].map((type) => ( promotion && (
              <button
                style={{ width: 60, height: 60, border: 'solid 1px', borderRadius: '50%', background: '#eea8cd' }}
                key={type}
                onClick={() => {handleClick(promotion.row, promotion.col, type); setPromotion(null)}}
              >
                {renderPieceImage(type, promotion.color)}
              </button>
            )
            ))}
          </div>
        </Modal>
        <Modal
          title="Kết thúc ván đấu"
          open={isGameOver}
          onOk={() => {
            resetGame();
            setShowDifficultyModal(true);}
          }
          onCancel={() => setIsGameOver(false)}
          okText="Chơi lại"
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <p>{result}</p>
        </Modal>
      </div>
      <div className="controls">
          <ReloadOutlined
            className="restart-icon"
            onClick={() => handleRestart()}
          />
      </div>
    </div>
    </>
  )
}

export default App
