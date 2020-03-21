type Color = 'red' | 'yellow' | 'blue' | 'green';

type Player = {
  name: string;
  color: Color;
};

type Piece = {
  area: 'home' | 'play' | 'goal';
  index: number; // home/goal: 0-3, play: 0-23
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
};

type RollResult = {
  roll: number;
  actions: []; // TODO
};

type DieState = { roll: number; position: number; orientation: number };
