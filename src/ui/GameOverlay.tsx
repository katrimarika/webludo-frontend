import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';

const GameOverlay: FunctionalComponent<{ text: string }> = ({ text }) => (
  <g>
    <rect
      x="0"
      y="0"
      width="1000"
      height="1000"
      className={css`
        fill: white;
        opacity: 0.85;
      `}
    />
    <text
      x="500"
      y="515"
      className={css`
        text-anchor: middle;
        font-size: 44px;
      `}
    >
      {text}
    </text>
  </g>
);

export default memo(GameOverlay);
