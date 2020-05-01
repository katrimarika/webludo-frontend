import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { theme } from '../utils/style';

const ShareLink: FunctionalComponent = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={css`
        position: relative;
      `}
    >
      <h3
        className={css`
          font-size: 1rem;
          margin: 0 0 0.5rem;
        `}
      >
        Link to this game
      </h3>
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
  );
};

export default ShareLink;
