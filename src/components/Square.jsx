import { CrownOutlined } from '@ant-design/icons';

import './Square.css'

const baseUrl = import.meta.env.BASE_URL;

const pieceImages = {
  wp: `${baseUrl}assets/chess/wp.png`,
  wr: `${baseUrl}assets/chess/wr.png`,
  wn: `${baseUrl}assets/chess/wn.png`,
  wb: `${baseUrl}assets/chess/wb.png`,
  wq: `${baseUrl}assets/chess/wq.png`,
  wk: `${baseUrl}assets/chess/wk.png`,
  bp: `${baseUrl}assets/chess/bp.png`,
  br: `${baseUrl}assets/chess/br.png`,
  bn: `${baseUrl}assets/chess/bn.png`,
  bb: `${baseUrl}assets/chess/bb.png`,
  bq: `${baseUrl}assets/chess/bq.png`,
  bk: `${baseUrl}assets/chess/bk.png`
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