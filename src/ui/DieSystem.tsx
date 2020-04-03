import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { theme } from '../utils/style';
import Die from './Die';

const DieSystem: FunctionalComponent<{
  die: DieState;
  rollDie: () => void;
  disabled?: boolean;
}> = ({ die, rollDie, disabled }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [die]);

  const canRoll = !disabled && !loading;
  // TODO: Animate die roll

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
      <Die {...die} />
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
