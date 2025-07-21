import { CrownOutlined } from '@ant-design/icons';

import './Square.css'

const pieceImages = {
  wp: '/assets/chess/wp.png',
  wr: '/assets/chess/wr.png',
  wn: '/assets/chess/wn.png',
  wb: '/assets/chess/wb.png',
  wq: '/assets/chess/wq.png',
  wk: '/assets/chess/wk.png',
  bp: '/assets/chess/bp.png',
  br: '/assets/chess/br.png',
  bn: '/assets/chess/bn.png',
  bb: '/assets/chess/bb.png',
  bq: '/assets/chess/bq.png',
  bk: '/assets/chess/bk.png',
};

function getSquareColor({ isBlack, isSelected, isHighlighted, isCapture, isLastMove }) {
    if (isSelected || isHighlighted) return isBlack ? '#7bb661' : '#cbe888';
    if (isCapture) return isBlack ? '#ff4d4d' : '#ff9999';
    if (isLastMove) return isBlack ? '#f7d065' : '#f7ec88';
  
    return isBlack ? '#b58863' : '#f0d9b5'; // mặc định
};

function Square({ isBlack, piece, onClick, isSelected, isHighlighted, isCapture, isLastMove, isInCheck }) {
    const backgroundColor = getSquareColor({ isBlack, isSelected, isHighlighted, isCapture, isLastMove });

    const style = {
      width: "10vh",
      height: "10vh",
      backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: piece ? "pointer" : "default",
    };

    return <div style = {isInCheck ? {} : style} className= {isInCheck ? "in-check" : ""} onClick={onClick}>
      {piece && (
        <img
          src={pieceImages[piece]}
          alt="chess piece"
          style={{ width: "90%", height: "90%" }}
        />
      )}
    </div>;  
}

export function TurnIndicator({ turn }) {
  const isWhite = turn === 'w';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '5px',
    }}>
      <div
        style={{
          backgroundColor: isWhite ? '#f0f0f0' : '#1f1f1f',
          color: isWhite ? '#000' : '#fff',
          paddingTop: '6px',
          paddingBottom: '6px',
          fontWeight: 'bold',
          fontSize: 16,
          borderRadius: 24,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          lineHeight: 1,
          width: '150px',
          textAlign: 'center',
        }}
      >
        <CrownOutlined />
        {isWhite ? 'Lượt Trắng' : 'Lượt Đen'}
      </div>
    </div>
  );
};

export function renderPieceImage(type, color) {
  const filename = `${color}${type}.png`;
  return (
    <img
      src={`/assets/chess/${filename}`}
      alt={`${color}${type}`}
      style={{ width: 40, height: 40, cursor: 'pointer' }}
    />
  );
};



export default Square