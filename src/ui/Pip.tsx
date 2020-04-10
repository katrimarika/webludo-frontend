import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const Pip: FunctionalComponent<{ x: number; y: number; filter?: string }> = ({
  x,
  y,
  filter,
}) => (
  <circle
    cx={x}
    cy={y}
    r="10"
    filter={filter}
    className={css`
      fill: ${!!filter ? theme.colors.gray : theme.colors.black};
    `}
  />
);

export default Pip;
