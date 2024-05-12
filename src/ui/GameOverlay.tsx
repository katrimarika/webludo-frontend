import { css } from '@emotion/css';
import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';

const GameOverlay: FunctionalComponent<{ text: string }> = ({ text }) => (
  <div
    className={css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      opacity: 0.85;
      display: flex;
      justify-content: center;
      align-items: center;
    `}
  >
    <div>{text}</div>
  </div>
);

export default memo(GameOverlay);
