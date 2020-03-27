import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const PageWrapper: FunctionalComponent<{ styles?: string }> = ({
  styles,
  children,
}) => (
  <div
    className={css`
      background: ${theme.colors.white};
      min-height: 100vh;
      @media screen and (orientation: landscape) {
        max-width: 1440px;
        margin: 0 auto;
      }
    `}
  >
    <div
      className={css`
        padding: 1rem 1.5rem 2rem;
        @media screen and (orientation: landscape) and (min-width: 1440px) {
          padding: 1.5rem 3rem 3rem;
        }
        ${styles}
      `}
    >
      {children}
    </div>
  </div>
);

export default PageWrapper;
