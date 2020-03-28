import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';
import { pieceCoord } from '../utils/helpers';
import { theme } from '../utils/style';
import { pieceSteps } from '../utils/validation';

const pulseAnimation = (color: Color) => keyframes`
  from {
    fill: ${theme.colors[color].main};
  }
  to {
    fill: ${theme.colors[color].text};
  }
`;

const GamePiece: FunctionalComponent<{
  piece: Piece;
  onClick?: () => void;
  moveFrom?: Piece;
  onMoveComplete: () => void;
}> = ({ piece, moveFrom, onMoveComplete, onClick }) => {
  const [moving, setMoving] = useState(false);

  const pieceCoords = [
    pieceCoord('x', piece) * 10,
    pieceCoord('y', piece) * 10,
  ];

  let moveAnimation = '';
  let animationDuration = 0;
  useEffect(() => {
    if (moveFrom && !moving) {
      setMoving(true);
      const animateSteps = pieceSteps(moveFrom, piece);
      animationDuration = animateSteps.length * 250;
      if (animateSteps.length) {
        const percentage = 100 / animateSteps.length;
        moveAnimation = keyframes`
          ${animateSteps.map((s, i) => {
            const change = [
              pieceCoord('x', s) * 10 - pieceCoords[0],
              pieceCoord('y', s) * 10 - pieceCoords[1],
            ];
            return css`
              ${i * percentage}% {
                transform: translate(${change[0]}px, ${change[1]}px);
              }
            `;
          })}
          100% {
            transform: translate(0, 0);
          }
        `;
      }
      setTimeout(() => {
        onMoveComplete();
        setMoving(false);
      }, animationDuration);
    }
  });

  return (
    <circle
      key={`piece-${piece.id}`}
      cx={`${pieceCoords[0]}`}
      cy={`${pieceCoords[1]}`}
      r="25"
      className={css`
        fill: ${theme.colors[piece.color].main};
        ${!!onClick &&
          css`
            animation: ${pulseAnimation(piece.color)} 1s alternate infinite;
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              stroke-width: 5;
              stroke: ${theme.colors.white};
            }
          `}
        ${!!moveAnimation &&
          animationDuration &&
          css`
            animation: ${moveAnimation} ${animationDuration}ms ease-in-out;
          `}
      `}
      onClick={onClick}
    />
  );
};

export default memo(GamePiece);
