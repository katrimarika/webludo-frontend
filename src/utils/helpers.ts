// Helper functions for game position calculations
// Game starts from top left "corner" and proceeds clockwise

export const colors = ['red', 'blue', 'yellow', 'green'] as const;

const playDist = 15;
const playStart = 90 + 45;

export const toRad = (deg: number) => (deg / 360) * 2 * Math.PI;

export const playCoord = (type: 'x' | 'y', i: number) => {
  // 24 play "squares": i = 0..23
  const rad = toRad(playStart - playDist * (i + 0.5));
  if (type === 'x') {
    return 50 + 45 * Math.cos(rad);
  } else {
    return 50 - 45 * Math.sin(rad);
  }
};

export const homeCoord = (type: 'x' | 'y', i: number, j: number) => {
  // 4 colors: i = 0..3, 4 "squares" each: j = 0..3
  const dist = 8.5; // distance from each other
  const rad = toRad(playStart + 1.5 * dist - 90 * i - dist * j);
  if (type === 'x') {
    return 50 + 53 * Math.cos(rad);
  } else {
    return 50 - 53 * Math.sin(rad);
  }
};

export const goalCoord = (type: 'x' | 'y', i: number, j: number) => {
  // 4 colors: i = 0..3, 4 "squares" each: j = 0..3
  const dist = 7.5;
  const rad = toRad(playStart - 90 * i);
  if (type === 'x') {
    return 50 + (39.5 - j * dist) * Math.cos(rad);
  } else {
    return 50 - (39.5 - j * dist) * Math.sin(rad);
  }
};

export const pieceCoord = (type: 'x' | 'y', piece: Piece) => {
  const colorIndex = colors.indexOf(piece.color);
  switch (piece.area) {
    case 'goal':
      return goalCoord(type, colorIndex, piece.index);
    case 'home':
      return homeCoord(type, colorIndex, piece.index);
    case 'play':
      return playCoord(type, piece.index);
    default:
      return 0;
  }
};

export const arrowCoord = (type: 'x' | 'y', i: number) => {
  const rad = toRad(playStart + 7.5 - 1 - 90 * i);
  if (type === 'x') {
    return 50 + 46 * Math.cos(rad) - (i === 1 || i === 2 ? 10 : 0);
  } else {
    return 50 - 46 * Math.sin(rad) - (i > 1 ? 10 : 0);
  }
};

export const dieCoord = (type: 'x' | 'y', rand: number) => {
  const rad = toRad(Math.floor(rand * 360));
  if (type === 'x') {
    return 47 + 5 * Math.cos(rad);
  } else {
    return 47 - 5 * Math.sin(rad);
  }
};

export const toStr = (val: any) => (typeof val === 'string' ? val : '');
export const toInt = (val: any) => parseInt(val, 10) || 0;

export const toGame = (data: any): Game | false => {
  if (!data) {
    console.error('No game details when expected');
    return false;
  }
  const code = toStr(data.code);
  const status = toStr(data.status) || 'not_started';
  const name = toStr(data.name);
  if (!code || !name) {
    console.error('Invalid game details', data);
    return false;
  }
  // Ensure the players are in join order
  const sortedPlayers = (Array.isArray(data.players)
    ? (data.players as any[])
    : []
  ).sort((a, b) => (a.inserted_at > b.inserted_at ? 1 : -1));
  const invalidPlayers: any[] = [];
  const players = sortedPlayers.reduce<Player[]>((list, p) => {
    const name = toStr(p.name);
    const color = toStr(p.color) as Color;
    if (name && color && colors.indexOf(color) !== -1) {
      list.push({ name, color });
    } else {
      invalidPlayers.push(p);
    }
    return list;
  }, []);
  if (invalidPlayers.length) {
    console.error('Invalid players', invalidPlayers);
    return false;
  }
  return {
    code,
    name,
    status,
    players,
  };
};

const toPiece = (data: any): Piece | false => {
  if (!data) {
    console.error('No game piece when expected');
    return false;
  }
  const area = toStr(data.area) as Piece['area'];
  const index = toInt(data.position_index);
  const color = toStr(data.player_color) as Color;
  if (
    ['home', 'play', 'goal'].indexOf(area) === -1 ||
    index < 0 ||
    colors.indexOf(color) === -1
  ) {
    return false;
  }
  return { area, index, color };
};

export const toGameState = (data: any): GameState | false => {
  if (!data) {
    console.error('No game state when expected');
    return false;
  }
  const currentColor = toStr(data.current_player) as Color;
  if (!!currentColor && colors.indexOf(currentColor) === -1) {
    console.error('Invalid game state', data);
    return false;
  }
  const invalidPieces: any[] = [];
  const pieces = Array.isArray(data.pieces)
    ? (data.pieces as any[]).reduce<Piece[]>((list, p) => {
        const piece = toPiece(p);
        if (!piece) {
          invalidPieces.push(p);
        } else {
          list.push(piece);
        }
        return list;
      }, [])
    : [];
  if (invalidPieces.length) {
    console.error('Invalid pieces', invalidPieces);
    return false;
  }
  return {
    currentColor: currentColor || null,
    pieces,
  };
};

export const noActions = { red: [], blue: [], yellow: [], green: [] };
export const toActions = (data: any): Actions | false => {
  if (!data) {
    console.error('No actions when expected');
    return false;
  }
  const invalidActions: any[] = [];
  const actions = colors.reduce<Actions>((obj, color) => {
    const colorData = data[color];
    if (Array.isArray(colorData)) {
      colorData.forEach(d => {
        const type = toStr(d.type) as Action['type'];
        switch (type) {
          case 'roll':
            obj[color] = [...obj[color], { type }];
            break;
          case 'move':
            const piece = toPiece(d.current);
            const moveTo = toPiece(d.target);
            if (!piece || !moveTo) {
              invalidActions.push(d);
            } else {
              obj[color] = [...obj[color], { type, piece, moveTo }];
            }
            break;
          default:
            invalidActions.push(d);
        }
      });
    }
    return obj;
  }, noActions);

  if (invalidActions.length) {
    console.error('Invalid actions', invalidActions);
    return false;
  }
  return actions;

  return false;
};
