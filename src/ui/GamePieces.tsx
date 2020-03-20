import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { pieceCoord } from '../utils/helpers';
import { theme } from '../utils/theme';

const pulseAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.6;
  }
`;

const GamePieces: FunctionalComponent<GameState> = ({
  pieces,
  currentColor,
}) => (
  <svg width="100%" height="100%">
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
          fill: ${theme.colors[p.color]};
        `}
      />
    ))}
  </svg>
);

export default GamePieces;
