import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import { pieceCoord } from '../utils/helpers';
import { theme } from '../utils/style';

const pulseAnimation = (color: Color) => keyframes`
  from {
    fill: ${theme.colors[color].main};
  }
  to {
    fill: ${theme.colors[color].text};
  }
`;

const GamePieces: FunctionalComponent<GameState> = ({
  pieces,
  currentColor,
}) => (
  <g>
    {pieces.map(p => (
      <circle
        key={`piece-${p.color}-${p.area}-${p.index}`}
        cx={`${pieceCoord('x', p) * 10}`}
        cy={`${pieceCoord('y', p) * 10}`}
        r="25"
        className={css`
          animation: ${p.color === currentColor
            ? `${pulseAnimation(p.color)} 1s alternate infinite`
            : 'none'};
          fill: ${theme.colors[p.color].main};
        `}
      />
    ))}
  </g>
);

export default memo(GamePieces);
