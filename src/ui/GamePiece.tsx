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

const GamePiece: FunctionalComponent<{
  piece: Piece;
  isCurrentAndOwnColor: boolean;
  onClick?: () => void;
}> = ({ piece, isCurrentAndOwnColor, onClick }) => (
  <circle
    key={`piece-${piece.color}-${piece.area}-${piece.index}`}
    cx={`${pieceCoord('x', piece) * 10}`}
    cy={`${pieceCoord('y', piece) * 10}`}
    r="25"
    className={css`
      fill: ${theme.colors[piece.color].main};
      ${isCurrentAndOwnColor &&
        !!onClick &&
        css`
          animation: ${pulseAnimation(piece.color)} 1s alternate infinite;
          cursor: pointer;
          &:hover,
          &:focus,
          &:active {
            stroke-width: 5;
            stroke: ${theme.colors.white};
          }
        `}
    `}
    onClick={onClick}
  />
);

export default memo(GamePiece);
