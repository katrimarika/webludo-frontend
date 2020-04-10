import { FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent<GameState & {
  playerColor: Color | null;
  actions: MoveAction[];
  takeAction: (action: MoveAction) => void;
  onMoveComplete: (type: 'move' | 'effect') => void;
}> = ({
  pieces,
  currentColor,
  playerColor,
  actions,
  takeAction,
  changes,
  onMoveComplete,
}) => {
  const { previousMove, effects } = changes;
  // Sort pieces so that the one moved is rendered last and therefore on top of others
  // And other animated pieces are under the moving pieces but on top of others
  const sortedPieces = !!previousMove
    ? pieces.sort((p1, p2) =>
        previousMove.pieceId === p1.id
          ? 1
          : previousMove.pieceId === p2.id
          ? -1
          : effects.some(e => e.pieceId === p1.id)
          ? 1
          : effects.some(e => e.pieceId === p2.id)
          ? -1
          : 0,
      )
    : pieces;
  return (
    <g>
      {sortedPieces.map(p => {
        const effectsMove = effects.find(e => e.pieceId === p.id) || undefined;
        const availableAction =
          !previousMove &&
          !effectsMove &&
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
                : effectsMove || undefined
            }
            onMoveComplete={() =>
              onMoveComplete(!previousMove ? 'effect' : 'move')
            }
            noAnimate={!!previousMove && previousMove.pieceId !== p.id}
          />
        );
      })}
    </g>
  );
};

export default memo(GamePieces);
