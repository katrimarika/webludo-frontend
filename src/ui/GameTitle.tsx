import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useRef } from 'preact/hooks';
import { theme } from '../utils/style';
import { useGameContext } from '../utils/gameContext';

const GameTitle: FunctionalComponent = () => {
  const { code, game } = useGameContext();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
          color: ${!game || !game.name ? theme.colors.gray : 'inherit'};
        `}
      >
        {(game && game.name) || '<No name>'}
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
            color: ${theme.colors.gray};
            font-weight: bold;
            margin-left: 0.25rem;
            padding: 0;
            border: none;
            background: none;
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              text-decoration: underline;
            }
          `}
          onClick={() => {
            if (textAreaRef.current) {
              textAreaRef.current.select();
              document.execCommand('copy');
            }
          }}
        >
          {code}
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
      </div>
    </div>
  );
};

export default GameTitle;
