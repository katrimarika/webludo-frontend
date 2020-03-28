import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent<GameState & {
  playerColor: Color | null;
  pieceActions: MoveAction[];
  takeAction: (action: Action) => void;
  onMoveComplete: () => void;
}> = ({
  pieces,
  currentColor,
  playerColor,
  pieceActions,
  takeAction,
  previousMove,
  onMoveComplete,
}) => (
  <g>
    {pieces.map(p => {
      const availableAction = pieceActions.find(a => a.moveFrom.id === p.id);
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
          moveFrom={
            previousMove && previousMove.moveFrom.id === p.id
              ? previousMove.moveFrom
              : undefined
          }
          onMoveComplete={onMoveComplete}
        />
      );
    })}
  </g>
);

export default memo(GamePieces);
