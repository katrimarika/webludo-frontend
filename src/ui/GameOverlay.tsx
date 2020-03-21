import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';

const GameOverlay: FunctionalComponent<{ text: string }> = ({ text }) => {
  return (
    <g>
      <rect
        x="0"
        y="0"
        className={css`
          width: 100%;
          height: 100%;
          fill: white;
          opacity: 0.85;
        `}
      />
      <text
        x="50%"
        y="50%"
        className={css`
          text-anchor: middle;
        `}
      >
        {text}
      </text>
    </g>
  );
};

export default GameOverlay;
