import { cx } from '@emotion/css';
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
  <button className={cx(buttonCss(color), extraCss)} {...rest}>
    {children}
  </button>
);

export default Button;
