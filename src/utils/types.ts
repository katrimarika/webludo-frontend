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
  id: string;
  players: Player[];
  status: 'not_started' | 'ongoing' | 'ended' | 'interrupted';
};

type GameState = {
  currentColor: Color | null;
  pieces: Piece[];
};
