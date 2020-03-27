import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const PageWrapper: FunctionalComponent<{ styles?: string }> = ({
  styles = '',
  children,
}) => (
  <div
    className={css`
      background: ${theme.colors.white};
      min-height: 100vh;
      @media screen and (orientation: landscape) {
        max-width: 60rem;
        margin: 0 auto;
        padding: 0 0.8rem;
      }
      @media screen and (orientation: landscape) and (min-width: 60rem) {
        padding: 0 1.8rem;
      }
    `}
  >
    <div
      className={css`
        padding: 1.2rem;
        ${styles}
      `}
    >
      {children}
    </div>
  </div>
);

export default PageWrapper;
