import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { pieceCoord, pieceSteps } from '../utils/helpers';
import { theme } from '../utils/style';
import { colors } from '../utils/validation';

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
  moveFrom?: MoveAnimation;
  noAnimate?: boolean;
  onMoveComplete: () => void;
}> = ({ piece, moveFrom, noAnimate, onMoveComplete, onClick }) => {
  const [move, setMove] = useState<{
    animation: string;
    duration: number;
  } | null>(null);

  const renderCoords = moveFrom
    ? [
        pieceCoord('x', {
          ...piece,
          area: moveFrom.startArea,
          index: moveFrom.startIndex,
        }) * 10,
        pieceCoord('y', {
          ...piece,
          area: moveFrom.startArea,
          index: moveFrom.startIndex,
        }) * 10,
      ]
    : [pieceCoord('x', piece) * 10, pieceCoord('y', piece) * 10];

  useEffect(() => {
    if (moveFrom && !move && !noAnimate) {
      const animateSteps = pieceSteps(piece, moveFrom);
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

  // TODO: fix center piece rotation to be in coords (to fix animation)
  // TODO: show multiplied piece differently
  // TODO: handle multiple pieces in home index 0

  return piece.area === 'center' && !move ? (
    <g
      key={`piece-${piece.id}`}
      transform={`rotate(${90 * colors.indexOf(piece.color)} 500 500)`}
    >
      <rect
        x={`${renderCoords[0] - 40}`}
        y={`${renderCoords[1] - 25}`}
        width="80"
        height="50"
        rx="1"
        className={css`
          fill: ${theme.colors[piece.color].main};
          font-size: 1rem;
          transform: translate(0px, 0px);
        `}
      />
      <rect
        x={`${renderCoords[0] - 2}`}
        y={`${renderCoords[1] - 29}`}
        width="4"
        height="58"
        rx="1"
        className={css`
          fill: ${theme.colors[piece.color].main};
          font-size: 1rem;
          transform: translate(0px, 0px);
        `}
      />
    </g>
  ) : (
    <circle
      key={`piece-${piece.id}`}
      cx={`${renderCoords[0]}`}
      cy={`${renderCoords[1]}`}
      r="25"
      className={css`
        fill: ${theme.colors[piece.color].main};
        font-size: 1rem;
        transform: translate(0px, 0px);
        ${!!onClick &&
          css`
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            -webkit-tap-highlight-color: transparent;
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
