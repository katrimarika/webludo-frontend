import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import { pieceCoord } from '../utils/helpers';
import { pulseAnimation, theme } from '../utils/style';

const GamePieces: FunctionalComponent<GameState> = ({
  pieces,
  currentColor,
}) => (
  <svg width="100%" height="100%" viewBox="0 0 1000 1000">
    {pieces.map(p => (
      <circle
        key={`piece-${p.color}-${p.area}-${p.index}`}
        cx={`${pieceCoord('x', p)}%`}
        cy={`${pieceCoord('y', p)}%`}
        r="2.5%"
        className={css`
          animation: ${p.color === currentColor
            ? `${pulseAnimation} 1s alternate infinite`
            : 'none'};
          fill: ${theme.colors[p.color].main};
        `}
      />
    ))}
  </svg>
);

export default memo(GamePieces);
