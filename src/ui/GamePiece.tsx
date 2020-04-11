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
  animateMove?: MoveAnimation;
  animateDoubled?: DoubledAnimation;
  animationComplete: () => void;
}> = ({ piece, animateMove, animateDoubled, animationComplete, onClick }) => {
  const [animation, setAnimation] = useState<{
    animation: string;
    duration: number;
  } | null>(null);

  const renderCoords = animateMove
    ? [
        pieceCoord('x', {
          ...piece,
          area: animateMove.startArea,
          index: animateMove.startIndex,
        }) * 10,
        pieceCoord('y', {
          ...piece,
          area: animateMove.startArea,
          index: animateMove.startIndex,
        }) * 10,
      ]
    : [pieceCoord('x', piece) * 10, pieceCoord('y', piece) * 10];

  useEffect(() => {
    if (!animation) {
      let animationDuration = 0;
      if (animateMove) {
        const animateSteps = pieceSteps(piece, animateMove);
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
          animationDuration = animateSteps.length * 500;
          setAnimation({
            animation: moveAnimation,
            duration: animationDuration,
          });
        }
      } else if (animateDoubled) {
        const turnAnimation = keyframes`
            0% {
              transform: translate(0px, 0px);
            }
            25% {
              transform: translate(10px, 10px);
            }
            50% {
              transform: translate(-10px, 10px);
            }
            75% {
              transform: translate(0px, -15px);
            }
            100% {
              transform: translate(0px, 0px);
            }
          `;
        animationDuration = 250;
        setAnimation({
          animation: turnAnimation,
          duration: animationDuration,
        });
      }
      if (animationDuration) {
        setTimeout(() => {
          animationComplete();
          setAnimation(null);
        }, animationDuration);
      }
    }
  });

  const { id, color, area, index, multiplier } = piece;

  return area === 'center' && !animation ? (
    <g
      key={`piece-${id}`}
      className={css`
        transform: translate(
            -${directionNumber(color, 27, 38)}px,
            -${directionNumber(color, 38, 27)}px
          )
          rotate(
            ${index === 0
              ? directionNumber(color, 15, 60)
              : index === 1
              ? -5
              : directionNumber(color, 75, 87)}deg
          );
        transform-origin: ${renderCoords[0] + directionNumber(color, 27, 38)}px
          ${renderCoords[1] + directionNumber(color, 38, 27)}px;
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
            !!animation
              ? `${animation.animation} ${animation.duration}ms forwards ease-in-out`
              : !!onClick
              ? `${pulseAnimation(color)} 1s alternate infinite`
              : 'none'
          };
        `}
        onClick={onClick}
      />
      {multiplier > 1 && (!animateDoubled || animateDoubled.multiplier === 1) && (
        <circle
          cx={renderCoords[0]}
          cy={renderCoords[1]}
          r="19"
          className={css`
            fill: ${theme.colors[color].text};
            font-size: 1rem;
            pointer-events: none;
            transform: translate(0px, 0px);
            animation: ${!!animation
              ? `${animation.animation} ${animation.duration}ms forwards ease-in-out`
              : 'none'};
          `}
        />
      )}
    </g>
  );
};

export default memo(GamePiece);
