import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useRef, useState, useEffect } from 'preact/hooks';
import { theme } from '../utils/style';

const SharePopup: FunctionalComponent<{ close: () => void }> = ({ close }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
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
        if (e.currentTarget === e.target) {
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
        `}
      >
        <h2
          className={css`
            font-size: 1.25rem;
            margin: 0 0 1rem;
          `}
        >
          Link to this game
        </h2>
        <button
          className={css`
            font-size: 1rem;
            border: none;
            background: none;
            cursor: pointer;
            padding: 0.25rem;
            margin: -0.25rem;
            word-break: break-all;
            text-align: initial;
            display: block;
            &:hover,
            &:focus,
            &:active {
              color: ${theme.colors.gray};
            }
          `}
          onClick={() => {
            if (textAreaRef.current) {
              textAreaRef.current.select();
              document.execCommand('copy');
              setCopied(true);
            }
          }}
        >
          <span
            className={css`
              display: block;
            `}
          >
            {window.location.href}
          </span>
          <span
            className={css`
              display: block;
              opacity: 0.5;
              padding-top: 0.25rem;
            `}
          >
            Click to copy
          </span>
        </button>
        <textarea
          readOnly
          ref={textAreaRef}
          className={css`
            display: block;
            opacity: 0;
            height: 0;
            padding: 0;
          `}
        >
          {window.location.href}
        </textarea>
        {copied && (
          <div
            className={css`
              font-size: 0.875rem;
              color: ${theme.colors.green.text};
              position: absolute;
              bottom: 1.5rem;
              right: 1.5rem;
              pointer-events: none;
            `}
          >
            Copied
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePopup;
