import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { dieCoord } from '../utils/helpers';
import { theme } from '../utils/style';
import Die from './Die';

const DieSystem: FunctionalComponent<{
  die: DieState;
  rollDie: () => void;
  disabled?: boolean;
  onAnimationComplete: () => void;
}> = ({ die, rollDie, disabled, onAnimationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState<{
    animation: string;
    duration: number;
  } | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [die]);

  const canRoll = !disabled && !loading && !die.animate;

  const { position, distance, orientation } = die;
  const from = [
    dieCoord('x', position, distance) * 10,
    dieCoord('y', position, distance) * 10,
    360 * orientation,
  ];

  useEffect(() => {
    if (die.animate && !animation) {
      const duration = 250;
      // TODO: animate also die roll number
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
        onAnimationComplete();
        setAnimation(null);
      }, duration + 100);
    }
  });

  return (
    <g>
      <circle
        cx="500"
        cy="500"
        r="100"
        className={css`
          stroke: black;
          stroke-width: 3;
          fill: ${theme.colors.silver};
        `}
      />
      <g
        className={css`
          transform: rotate(0deg) translate(0px, 0px);
          transform-origin: ${from[0]}px ${from[1]}px;
          animation: ${animation
            ? `${animation.animation} ${animation.duration}ms ease-out`
            : 'none'};
        `}
      >
        <Die {...die} />
      </g>
      <circle
        cx="500"
        cy="500"
        r="90"
        className={css`
          font-size: 1rem;
          stroke: black;
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
                rollDie();
              }
        }
      />
    </g>
  );
};

export default DieSystem;
