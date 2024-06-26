import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import GamePiece from './GamePiece';

const GamePieces: FunctionalComponent = () => {
  const {
    game,
    ownColor,
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
  const sortedPieces = pieces.sort((p1, p2) =>
    !!move && move.pieceId === p1.id
      ? 1
      : !!move && move.pieceId === p2.id
      ? -1
      : effects.some(e => e.pieceId === p1.id)
      ? 1
      : effects.some(e => e.pieceId === p2.id)
      ? -1
      : 0,
  );
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
          p.color === ownColor &&
          actions.find(a => a.pieceId === p.id);
        const drawPiece = moveAnimation
          ? {
              ...p,
              area: moveAnimation.startArea,
              index: moveAnimation.startIndex,
              multiplier: doubledAnimation
                ? doubledAnimation.multiplier === 1
                  ? 2
                  : 1
                : (effectsAnimation && effectsAnimation.startMultiplier) ||
                  p.multiplier,
            }
          : {
              ...p,
              area: effectsAnimation ? effectsAnimation.startArea : p.area,
              index: effectsAnimation ? effectsAnimation.startIndex : p.index,
              multiplier: doubledAnimation
                ? doubledAnimation.multiplier === 1
                  ? 2
                  : 1
                : (effectsAnimation && effectsAnimation.startMultiplier) ||
                  p.multiplier,
            };
        return (
          <GamePiece
            key={`piece-${p.id}`}
            piece={drawPiece}
            onClick={
              availableAction ? () => takeAction(availableAction) : undefined
            }
            animateMove={
              moveAnimation ||
              (!!doubled || !!move ? undefined : effectsAnimation)
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
