type Color = 'red' | 'yellow' | 'blue' | 'green';

type Player = {
  name: string;
  color: Color;
  penalties: number;
  newRaiseRound: boolean;
};

type Piece = {
  id: number;
  area: 'home' | 'play' | 'goal' | 'center';
  index: number; // home/goal: 0-3, play: 0-27, center: 0-2
  color: Color;
  multiplier: number; // 1-4
  goal0?: number; // extra index for additional pieces in goal index 0
};

type Game = {
  code: string;
  name: string;
  players: Player[];
  currentColor: Color | null;
  pieces: Piece[];
  newRaiseRound: boolean;
};

type Changes = {
  move: MoveAnimation | null;
  doubled: DoubledAnimation | null;
  effects: MoveAnimation[];
};

type MoveAction = {
  pieceId: number;
  area: Piece['area'];
  index: number;
  type: 'move' | 'raise';
};

type MoveAnimation = {
  pieceId: number;
  startArea: Piece['area'];
  startIndex: number;
  targetArea: Piece['area'];
  targetIndex: number;
};

type DoubledAnimation = {
  pieceId: number;
  multiplier: number;
};

type DieState = {
  roll: number;
  position: number;
  distance: number;
  orientation: number;
  animate?: boolean;
};

type OnError = (e: string) => void;

type ChatMessage =
  | {
      type: 'message';
      player: string;
      message: string;
      timestamp: number;
    }
  | {
      type: 'announcement';
      message: string;
      timestamp: number;
    };
