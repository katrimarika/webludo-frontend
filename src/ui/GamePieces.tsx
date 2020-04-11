import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent = () => {
  const {
    game,
    playerColor,
    actions,
    changes,
    animationOngoing,
    takeAction,
    changeAnimationComplete,
  } = useGameContext();

  if (!game) {
    return null;
  }
  const { pieces, currentColor } = game;

  const { move, doubled, effects } = changes;
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
        const moveAnimation = move && move.pieceId === p.id ? move : undefined;
        const doubledAnimation =
          doubled && doubled.pieceId === p.id ? doubled : undefined;
        const effectsAnimation = effects.find(e => e.pieceId === p.id);
        const availableAction =
          !animationOngoing &&
          p.color === currentColor &&
          p.color === playerColor &&
          actions.find(a => a.pieceId === p.id);
        return (
          <GamePiece
            key={`piece-${p.id}`}
            piece={
              doubledAnimation
                ? {
                    ...p,
                    multiplier: doubledAnimation.multiplier === 1 ? 2 : 1,
                  }
                : p
            }
            onClick={
              availableAction ? () => takeAction(availableAction) : undefined
            }
            animateMove={
              moveAnimation || (doubledAnimation ? undefined : effectsAnimation)
            }
            animateDoubled={!move ? doubledAnimation : undefined}
            animationComplete={() =>
              changeAnimationComplete(
                moveAnimation
                  ? 'move'
                  : doubledAnimation
                  ? 'doubled'
                  : 'effects',
              )
            }
          />
        );
      })}
    </g>
  );
};

export default GamePieces;
