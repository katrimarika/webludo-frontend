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
  previousMove,
  onMoveComplete,
}) => (
  <g>
    {pieces.map(p => {
      const availableAction =
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

export default memo(GamePieces);
