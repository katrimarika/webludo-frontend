import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';
import { pieceCoord, pieceSteps } from '../utils/helpers';
import { theme } from '../utils/style';

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
  isCurrentAndOwnColor: boolean;
  onClick?: () => void;
  moveFrom?: Piece;
  onMoveComplete: () => void;
}> = ({ piece, isCurrentAndOwnColor, moveFrom, onMoveComplete, onClick }) => {
  const [moving, setMoving] = useState(false);

  let moveAnimation = '';
  let animationDuration = 0;
  useEffect(() => {
    if (moveFrom && !moving) {
      setMoving(true);
      const animateSteps = pieceSteps(moveFrom, piece);
      animationDuration = animateSteps.length * 250;
      if (animateSteps.length) {
        const percentage = 100 / animateSteps.length;
        let prevCoords = [
          pieceCoord('x', moveFrom) * 10,
          pieceCoord('y', moveFrom) * 10,
        ];
        moveAnimation = keyframes`
          ${animateSteps.map((s, i) => {
            const newCoords = [
              pieceCoord('x', s) * 10,
              pieceCoord('y', s) * 10,
            ];
            const change = [
              newCoords[0] - prevCoords[0],
              newCoords[1] - prevCoords[1],
            ];
            prevCoords = newCoords;
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
      setTimeout(onMoveComplete, animationDuration);
    }
  });

  return (
    <circle
      key={`piece-${piece.id}`}
      cx={`${pieceCoord('x', piece) * 10}`}
      cy={`${pieceCoord('y', piece) * 10}`}
      r="25"
      className={css`
        fill: ${theme.colors[piece.color].main};
        ${isCurrentAndOwnColor &&
          !!onClick &&
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
