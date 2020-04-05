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
const directionNumber = (color: Color, val1: number, val2: number) =>
  colors.indexOf(color) % 2 ? val1 : val2;

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

  const { id, color, area, index, multiplier } = piece;

  return area === 'center' && !move ? (
    <g
      key={`piece-${id}`}
      transform={`translate(-${directionNumber(
        color,
        27,
        38,
      )}, -${directionNumber(color, 38, 27)}), rotate(${
        index === 0
          ? directionNumber(color, 15, 60)
          : index === 1
          ? -5
          : directionNumber(color, 75, 87)
      } ${directionNumber(color, 27, 38)} ${directionNumber(color, 38, 27)})`}
      className={css`
        transform-origin: ${renderCoords[0]}px ${renderCoords[1]}px;
      `}
    >
      <svg
        x={renderCoords[0]}
        y={renderCoords[1]}
        width={directionNumber(color, 54, 76)}
        height={directionNumber(color, 76, 54)}
        viewBox={`0 0 ${directionNumber(color, 54, 76)} ${directionNumber(
          color,
          76,
          54,
        )}`}
      >
        <rect
          x={directionNumber(color, 4, 0)}
          y={directionNumber(color, 0, 4)}
          width={directionNumber(color, 46, 76)}
          height={directionNumber(color, 76, 46)}
          rx="2"
          className={css`
            fill: ${theme.colors[color].main};
            font-size: 1rem;
          `}
        />
        <rect
          x={directionNumber(color, 0, 36)}
          y={directionNumber(color, 36, 0)}
          width={directionNumber(color, 54, 4)}
          height={directionNumber(color, 4, 54)}
          rx="1"
          className={css`
            fill: ${theme.colors[color].main};
            font-size: 1rem;
            stroke-width: 1;
            stroke: ${theme.colors[color].text};
          `}
        />
      </svg>
    </g>
  ) : (
    <g key={`piece-${id}`}>
      <circle
        cx={renderCoords[0]}
        cy={renderCoords[1]}
        r="25"
        className={css`
          fill: ${theme.colors[color].main};
          font-size: 1rem;
          transform: translate(0px, 0px);
          stroke-width: 1;
          stroke: ${theme.colors.white};
          ${!!onClick &&
            css`
              cursor: pointer;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
              -webkit-tap-highlight-color: transparent;
              &:hover,
              &:focus,
              &:active {
                stroke-width: 5;
              }
            `}
          animation: ${
            !!move
              ? `${move.animation} ${move.duration}ms forwards ease-in-out`
              : !!onClick
              ? `${pulseAnimation(color)} 1s alternate infinite`
              : 'none'
          };
        `}
        onClick={onClick}
      />
      {multiplier > 1 && (
        <circle
          cx={renderCoords[0]}
          cy={renderCoords[1]}
          r="19"
          className={css`
            fill: ${theme.colors[color].text};
            font-size: 1rem;
            pointer-events: none;
            transform: translate(0px, 0px);
            animation: ${!!move
              ? `${move.animation} ${move.duration}ms forwards ease-in-out`
              : !!onClick
              ? `${pulseAnimation(color)} 1s alternate infinite`
              : 'none'};
          `}
        />
      )}
    </g>
  );
};

export default memo(GamePiece);
