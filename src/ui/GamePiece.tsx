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
  isCurrentColor: boolean;
  onClick?: () => void;
}> = ({ piece, isCurrentColor, onClick }) => (
  <circle
    key={`piece-${piece.color}-${piece.area}-${piece.index}`}
    cx={`${pieceCoord('x', piece) * 10}`}
    cy={`${pieceCoord('y', piece) * 10}`}
    r="25"
    className={css`
      animation: ${isCurrentColor
        ? `${pulseAnimation(piece.color)} 1s alternate infinite`
        : 'none'};
      fill: ${theme.colors[piece.color].main};
      ${!!onClick &&
        css`
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
