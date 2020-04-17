import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useGameContext } from '../utils/gameContext';
import { dieCoord } from '../utils/helpers';
import { theme } from '../utils/style';
import Die from './Die';

const pipAnimation = (i: number) => keyframes`
  ${i * 33}% {
    opacity: 0;
  }
  ${(1 - i) * 33}% {
    opacity: 1;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;
const randomRolls = (current: number) => {
  const pool = [...new Array(6)]
    .map((_, i) => i + 1)
    .filter(i => i !== current);
  const first = pool[Math.floor(Math.random() * pool.length)];
  const newPool = pool.filter(i => i !== first);
  const second = newPool[Math.floor(Math.random() * newPool.length)];
  return [first, second];
};

const DieSystem: FunctionalComponent = () => {
  const {
    die,
    takeAction,
    disabled: gameDisabled,
    actions,
    animationOngoing,
    ownTurn,
    dieAnimationComplete,
  } = useGameContext();

  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState<{
    animation: string;
    duration: number;
  } | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [die]);

  const disabled =
    gameDisabled ||
    !ownTurn ||
    animationOngoing ||
    !!actions.filter(a => a.type === 'move').length;
  const { roll, position, distance, orientation, animate } = die;
  const canRoll = !disabled && !loading && !animate;
  const from = [
    dieCoord('x', position, distance) * 10,
    dieCoord('y', position, distance) * 10,
    360 * orientation,
  ];

  useEffect(() => {
    if (animate && !animation) {
      const duration = 600;
      const animation = keyframes`
          ${[...new Array(3)].map((_, i) => {
            const nextPosition = Math.random();
            const nextDistance = Math.random();
            const nextOrientation = Math.random();
            const change = [
              dieCoord('x', nextPosition, nextDistance) * 10 - from[0],
              dieCoord('y', nextPosition, nextDistance) * 10 - from[1],
              360 * nextOrientation - from[2],
            ];
            return css`
              ${i * 33}% {
                transform: translate(${change[0]}px, ${change[1]}px)
                  rotate(${change[2]}deg);
              }
            `;
          })}
          100% {
            transform: rotate(0deg) translate(0px, 0px);
          }
        `;
      setAnimation({
        animation,
        duration,
      });
      setTimeout(() => {
        dieAnimationComplete();
        setAnimation(null);
      }, duration + 100);
    }
  });

  return (
    <g>
      <defs>
        <filter id="dieBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
      <circle
        cx="500"
        cy="500"
        r="100"
        className={css`
          stroke: ${theme.colors.black};
          stroke-width: 3;
          fill: ${theme.colors.silver};
        `}
      />
      <g
        className={css`
          transform: rotate(0deg) translate(0px, 0px);
          transform-origin: ${from[0]}px ${from[1]}px;
          animation: ${animation
            ? `${animation.animation} ${animation.duration}ms ease-out `
            : 'none'};
        `}
      >
        <Die {...die} />
        {(animate || !!animation) &&
          randomRolls(roll).map((r, i) => (
            <g
              key={`animate-die-${i}`}
              className={css`
                opacity: ${!animation ? 1 : 0};
                animation: ${animation
                  ? `${pipAnimation(i)} ${animation.duration}ms step-end `
                  : 'none'};
              `}
            >
              <Die {...die} roll={r} filter="url(#dieBlur)" />
            </g>
          ))}
      </g>
      <circle
        cx="500"
        cy="500"
        r="90"
        className={css`
          font-size: 1rem;
          stroke: ${theme.colors.black};
          stroke-width: 3;
          fill: transparent;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
          ${canRoll &&
            css`
              cursor: pointer;
              &:hover,
              &:focus,
              &:active {
                fill: rgba(128, 128, 128, 0.6);
                stroke-width: 4;
              }
            `}
        `}
        onClick={
          disabled || loading
            ? undefined
            : () => {
                setLoading(true);
                takeAction('roll');
              }
        }
      />
    </g>
  );
};

export default DieSystem;
