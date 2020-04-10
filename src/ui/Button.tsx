import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { buttonCss } from '../utils/style';

const Button: FunctionalComponent<{
  color?: Color;
  extraCss?: string;
} & h.JSX.HTMLAttributes<HTMLButtonElement>> = ({
  color,
  extraCss,
  children,
  ...rest
}) => (
  <button
    className={css`
      ${buttonCss(color)}
      ${extraCss}
    `}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
