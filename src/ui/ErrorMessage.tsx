import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const ErrorMessage: FunctionalComponent<{
  text: string;
  prefix?: string;
  styles?: string;
}> = ({ text, prefix, styles }) => {
  if (!text) {
    return null;
  }

  return (
    <div
      className={css`
        font-size: 0.75rem;
        color: ${theme.colors.red.text};
        ${styles}
      `}
    >
      {`${prefix || ''}${text}`}
    </div>
  );
};

export default ErrorMessage;
