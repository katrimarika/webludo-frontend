import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import CopyIcon from 'url:../assets/copy.svg';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';

const fadeAnimation = keyframes`
  0% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const GameTitle: FunctionalComponent<{ prefix?: string }> = ({ prefix }) => {
  const { code, game } = useGameContext();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={css`
        margin-bottom: 1rem;
      `}
    >
      <h1
        className={css`
          display: inline;
          font-size: 1.5rem;
          margin: 0;
        `}
      >
        {!!prefix && <span>{prefix}</span>}
        {game && game.name ? (
          <span>{game.name}</span>
        ) : (
          <span
            className={css`
              color: ${theme.colors.gray};
            `}
          >
            {'<No name>'}
          </span>
        )}{' '}
      </h1>
      <div
        className={css`
          display: inline-block;
          position: relative;
        `}
      >
        <button
          className={css`
            font-size: 1rem;
            color: ${theme.colors.boardPath};
            font-weight: bold;
            padding: 0;
            border: none;
            background: none;
            white-space: nowrap;
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              text-decoration: underline;
            }
          `}
          title="Copy link to this game"
          onClick={() => {
            if (textAreaRef.current) {
              textAreaRef.current.select();
              document.execCommand('copy');
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          }}
        >
          <span>{code}</span>
          <img
            src={CopyIcon}
            className={css`
              height: 0.75rem;
              margin-left: 0.125rem;
            `}
          />
        </button>
        {copied && (
          <div
            className={css`
              font-size: 0.75rem;
              color: ${theme.colors.gray};
              position: absolute;
              top: 100%;
              right: 0;
              pointer-events: none;
              display: ${copied ? 'block' : 'none'};
              animation: ${fadeAnimation} 1600ms ease-out;
            `}
          >
            Copied
          </div>
        )}
        <textarea
          readOnly
          ref={textAreaRef}
          className={css`
            display: inline-block;
            opacity: 0;
            position: absolute;
            z-index: -1;
            pointer-events: none;
          `}
          tabIndex={-1}
        >
          {window.location.href}
        </textarea>
      </div>
    </div>
  );
};

export default GameTitle;
