import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';
import Die from './Die';

const DieSystem: FunctionalComponent<{
  die: DieState;
  onRoll: () => void;
  disabled?: boolean;
}> = ({ die, onRoll, disabled }) => (
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
      disabled={disabled}
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
      onClick={disabled ? undefined : onRoll}
    />
  </g>
);

export default DieSystem;
