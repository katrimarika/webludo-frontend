type Color = 'red' | 'yellow' | 'blue' | 'green';

type Player = {
  name: string;
  color: Color;
};

type Piece = {
  id: number;
  area: 'home' | 'play' | 'goal';
  index: number; // home/goal: 0-3, play: 0-27
  color: Color;
};

type Game = {
  code: string;
  name: string;
  players: Player[];
  status: 'not_started' | 'ongoing' | 'ended' | 'interrupted' | string;
};

type GameState = {
  currentColor: Color | null;
  pieces: Piece[];
  previousMove: MoveAction | null;
};

type MoveAction = {
  pieceId: number;
  area: Piece['area'];
  index: number;
};

type DieState = {
  roll: number;
  position: number;
  distance: number;
  orientation: number;
};

type OnError = (e: string) => void;
