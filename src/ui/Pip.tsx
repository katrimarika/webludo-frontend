import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const Pip: FunctionalComponent<{ x: number; y: number }> = ({ x, y }) => (
  <circle
    cx={x}
    cy={y}
    r="10"
    className={css`
      fill: ${theme.colors.black};
    `}
  />
);

export default Pip;
