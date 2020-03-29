import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent<GameState & {
  playerColor: Color | null;
  actions: MoveAction[];
  takeAction: (action: MoveAction) => void;
  onMoveComplete: () => void;
}> = ({
  pieces,
  currentColor,
  playerColor,
  actions,
  takeAction,
  changes,
  onMoveComplete,
}) => {
  const { previousMove } = changes;
  // Sort pieces so that the one(s) allowed to move are rendered last and therefore on top of others
  const sortedPieces = !!previousMove
    ? pieces.sort((p1, p2) =>
        previousMove.pieceId === p1.id
          ? 1
          : previousMove.pieceId === p2.id
          ? -1
          : 0,
      )
    : pieces;
  return (
    <g>
      {sortedPieces.map(p => {
        const availableAction =
          !previousMove &&
          p.color === currentColor &&
          p.color === playerColor &&
          actions.find(a => a.pieceId === p.id);
        return (
          <GamePiece
            key={`piece-${p.id}`}
            piece={p}
            onClick={
              availableAction ? () => takeAction(availableAction) : undefined
            }
            moveFrom={
              previousMove && previousMove.pieceId === p.id
                ? previousMove
                : undefined
            }
            onMoveComplete={onMoveComplete}
          />
        );
      })}
    </g>
  );
};

export default memo(GamePieces);
