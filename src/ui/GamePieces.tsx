import { FunctionalComponent, h } from 'preact';

const GamePieces: FunctionalComponent<GameState> = () => (
  <svg width="100%" height="100%">
    <circle cx="5%" cy="5%" r="3%" fill="green" />
  </svg>
);

export default GamePieces;
