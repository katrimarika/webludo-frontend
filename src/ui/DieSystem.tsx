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
      cx="50%"
      cy="50%"
      r="10%"
      className={css`
        stroke: black;
        stroke-width: 0.08rem;
        fill: ${theme.colors.silver};
      `}
    />
    <Die {...die} />
    <circle
      cx="50%"
      cy="50%"
      r="9%"
      disabled={disabled}
      className={css`
        stroke: black;
        stroke-width: 0.08rem;
        fill: transparent;
        &:not(:disabled) {
          cursor: pointer;
          &:hover,
          &:focus,
          &:active {
            fill: rgba(128, 128, 128, 0.6);
            stroke-width: 0.1rem;
          }
        }
      `}
      onClick={disabled ? undefined : onRoll}
    />
  </g>
);

export default DieSystem;
