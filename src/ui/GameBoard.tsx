import { FunctionalComponent, h } from 'preact';

const GameBoard: FunctionalComponent = () => (
  <svg>
    <circle
      cx="50%"
      cy="50%"
      r="49%"
      stroke="green"
      strokeWidth="4"
      fill="yellow"
    />
  </svg>
);

export default GameBoard;
