import { FunctionalComponent, h } from 'preact';
import GamePiece from './GamePiece';
import { useGameContext } from '../utils/gameContext';

const GamePieces: FunctionalComponent = () => {
  const {
    playerColor,
    gameState,
    actions,
    takeAction,
    moveAnimationComplete,
  } = useGameContext();

  if (!gameState) {
    return null;
  }
  const { pieces, currentColor, changes } = gameState;

  const { move, effects } = changes;
  // Sort pieces so that the one moved is rendered last and therefore on top of others
  // And other animated pieces are under the moving pieces but on top of others
  const sortedPieces = !!move
    ? pieces.sort((p1, p2) =>
        move.pieceId === p1.id
          ? 1
          : move.pieceId === p2.id
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
          !move &&
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
              move && move.pieceId === p.id ? move : effectsMove || undefined
            }
            onMoveComplete={() =>
              moveAnimationComplete(!move ? 'effects' : 'move')
            }
            noAnimate={!!move && move.pieceId !== p.id}
          />
        );
      })}
    </g>
  );
};

export default GamePieces;
