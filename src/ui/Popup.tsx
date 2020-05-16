import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { theme } from '../utils/style';

const Popup: FunctionalComponent<{ close?: () => void }> = ({
  close,
  children,
}) => {
  useEffect(() => {
    document.body.classList.add('noscroll');
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && close) {
        close();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.body.classList.remove('noscroll');
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <div
      className={css`
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
      `}
      onClick={e => {
        if (e.currentTarget === e.target && close) {
          close();
        }
      }}
    >
      <div
        className={css`
          position: relative;
          background: ${theme.colors.white};
          border: 1px solid ${theme.colors.highlight};
          border-radius: 0.1875rem;
          padding: 1.5rem;
          max-width: 1024px;
          margin: 1rem;
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          @media screen and (orientation: landscape) {
            margin: 1.5rem;
          }
          @media screen and (orientation: landscape) and (min-width: 1440px) {
            margin: 1.5rem 3rem;
          }
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
