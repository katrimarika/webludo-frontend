import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
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
  onClick?: () => void;
  moveFrom?: MoveAction;
  onMoveComplete: () => void;
}> = ({ piece, moveFrom, onMoveComplete, onClick }) => {
  const [move, setMove] = useState<{
    animation: string;
    duration: number;
  } | null>(null);

  const renderCoords = moveFrom
    ? [
        pieceCoord('x', {
          ...piece,
          area: moveFrom.area,
          index: moveFrom.index,
        }) * 10,
        pieceCoord('y', {
          ...piece,
          area: moveFrom.area,
          index: moveFrom.index,
        }) * 10,
      ]
    : [pieceCoord('x', piece) * 10, pieceCoord('y', piece) * 10];

  useEffect(() => {
    if (moveFrom && !move) {
      const animateSteps = pieceSteps(moveFrom, piece);
      if (animateSteps.length) {
        const percentage = 100 / animateSteps.length;
        const moveAnimation = keyframes`
          0% {
            transform: translate(0px, 0px);
          }
          ${animateSteps.map((s, i) => {
            const change = [
              pieceCoord('x', s) * 10 - renderCoords[0],
              pieceCoord('y', s) * 10 - renderCoords[1],
            ];
            return css`
              ${(i + 1) * percentage}% {
                transform: translate(${change[0]}px, ${change[1]}px);
              }
            `;
          })}
        `;
        const animationDuration = animateSteps.length * 500;
        setMove({
          animation: moveAnimation,
          duration: animationDuration,
        });
        setTimeout(() => {
          onMoveComplete();
          setMove(null);
        }, animationDuration + 100);
      }
    }
  });

  return (
    <circle
      key={`piece-${piece.id}`}
      cx={`${renderCoords[0]}`}
      cy={`${renderCoords[1]}`}
      r="25"
      className={css`
        fill: ${theme.colors[piece.color].main};
        font-size: 1rem;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-tap-highlight-color: transparent;
        transform: translate(0px, 0px);
        ${!!onClick &&
          css`
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              stroke-width: 5;
              stroke: ${theme.colors.white};
            }
          `}
        animation: ${
          !!move
            ? `${move.animation} ${move.duration}ms forwards ease-in-out`
            : !!onClick
            ? `${pulseAnimation(piece.color)} 1s alternate infinite`
            : 'none'
        };
      `}
      onClick={onClick}
    />
  );
};

export default memo(GamePiece);
