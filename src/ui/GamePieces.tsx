import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent<GameState & {
  playerColor: Color | null;
  actions: MoveAction[];
  takeAction: (action: MoveAction) => void;
  onMoveComplete: (type: 'move' | 'eaten') => void;
}> = ({
  pieces,
  currentColor,
  playerColor,
  actions,
  takeAction,
  changes,
  onMoveComplete,
}) => {
  const { previousMove, eaten } = changes;
  // Sort pieces so that the one moved is rendered last and therefore on top of others
  // And those eaten are under the moving pieces but on top of others
  const sortedPieces = !!previousMove
    ? pieces.sort((p1, p2) =>
        previousMove.pieceId === p1.id
          ? 1
          : previousMove.pieceId === p2.id
          ? -1
          : eaten.some(e => e.pieceId === p1.id)
          ? 1
          : eaten.some(e => e.pieceId === p2.id)
          ? -1
          : 0,
      )
    : pieces;
  return (
    <g>
      {sortedPieces.map(p => {
        const eatenMove = eaten.find(e => e.pieceId === p.id) || undefined;
        const availableAction =
          !previousMove &&
          !eatenMove &&
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
                : eatenMove || undefined
            }
            onMoveComplete={() =>
              onMoveComplete(!previousMove ? 'eaten' : 'move')
            }
            noAnimate={!!previousMove && previousMove.pieceId !== p.id}
          />
        );
      })}
    </g>
  );
};

export default memo(GamePieces);
