import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent<GameState & {
  playerColor: Color | null;
  pieceActions: MoveAction[];
  takeAction: (action: Action) => void;
}> = ({ pieces, currentColor, playerColor, pieceActions, takeAction }) => (
  <g>
    {pieces.map(p => {
      const availableAction = pieceActions.find(
        a =>
          a.piece.area === p.area &&
          a.piece.color === p.color &&
          a.piece.index === p.index,
      );
      return (
        <GamePiece
          key={`piece-${p.color}-${p.area}-${p.index}`}
          piece={p}
          isCurrentAndOwnColor={
            p.color === currentColor && p.color === playerColor
          }
          onClick={
            availableAction ? () => takeAction(availableAction) : undefined
          }
        />
      );
    })}
  </g>
);

export default memo(GamePieces);
