export const mockGameState: GameState = {
  currentColor: 'blue',
  previousMove: {
    type: 'move',
    moveFrom: {
      id: 56,
      color: 'blue',
      area: 'play',
      index: 6,
    },
    moveTo: {
      id: 56,
      color: 'blue',
      area: 'play',
      index: 8,
    },
  },
  pieces: [
    {
      id: 34,
      color: 'red',
      area: 'home',
      index: 0,
    },
    {
      id: 35,
      color: 'red',
      area: 'home',
      index: 1,
    },
    {
      id: 36,
      color: 'red',
      area: 'home',
      index: 2,
    },
    {
      id: 37,
      color: 'red',
      area: 'home',
      index: 3,
    },
    {
      id: 56,
      color: 'blue',
      area: 'play',
      index: 8,
    },
    {
      id: 57,
      color: 'blue',
      area: 'home',
      index: 1,
    },
    {
      id: 58,
      color: 'blue',
      area: 'home',
      index: 2,
    },
    {
      id: 59,
      color: 'blue',
      area: 'home',
      index: 0,
    },
    {
      id: 23,
      color: 'yellow',
      area: 'play',
      index: 15,
    },
    {
      id: 24,
      color: 'yellow',
      area: 'home',
      index: 1,
    },
    {
      id: 25,
      color: 'yellow',
      area: 'home',
      index: 2,
    },
    {
      id: 26,
      color: 'yellow',
      area: 'home',
      index: 0,
    },
    {
      id: 44,
      color: 'green',
      area: 'play',
      index: 3,
    },
    {
      id: 45,
      color: 'green',
      area: 'home',
      index: 1,
    },
    {
      id: 46,
      color: 'green',
      area: 'home',
      index: 2,
    },
    {
      id: 47,
      color: 'green',
      area: 'home',
      index: 0,
    },
  ],
};

export const mockPlayers: Player[] = [
  {
    name: 'Teemu',
    color: 'red',
  },
  {
    name: 'Mikko',
    color: 'blue',
  },
  {
    name: 'Jussi',
    color: 'yellow',
  },
  {
    name: 'Pasi',
    color: 'green',
  },
];
