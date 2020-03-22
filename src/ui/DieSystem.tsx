import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { theme } from '../utils/style';
import Die from './Die';

const DieSystem: FunctionalComponent<{
  die: DieState;
  onRoll: () => void;
  disabled?: boolean;
}> = ({ die, onRoll, disabled }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [die]);

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
        disabled={disabled || loading}
        className={css`
          stroke: black;
          stroke-width: 3;
          fill: transparent;
          &:not(:disabled) {
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              fill: rgba(128, 128, 128, 0.6);
              stroke-width: 4;
            }
          }
        `}
        onClick={
          disabled || loading
            ? undefined
            : () => {
                setLoading(true);
                onRoll();
              }
        }
      />
    </g>
  );
};

export default DieSystem;
