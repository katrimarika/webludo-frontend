// Data type helpers and validation
export const colors = ['red', 'blue', 'yellow', 'green'] as const;

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
  const id = toInt(data.id);
  const area = toStr(data.area) as Piece['area'];
  const index = toInt(data.position_index);
  const color = toStr(data.player_color) as Color;
  if (
    !id ||
    ['home', 'play', 'goal'].indexOf(area) === -1 ||
    index < 0 ||
    colors.indexOf(color) === -1
  ) {
    return false;
  }
  return { id, area, index, color };
};

const toMoveAction = (data: any): MoveAction | false => {
  if (!data) {
    return false;
  }
  const type = data.type === 'move' ? 'move' : false;
  const moveFrom = toPiece(data.current);
  const moveTo = toPiece(data.target);
  if (!type || !moveFrom || !moveTo) {
    return false;
  } else {
    return { type, moveFrom, moveTo };
  }
};

export const toGameState = (data: any): GameState | false => {
  if (!data) {
    console.error('No game state when expected');
    return false;
  }
  const currentColor = toStr(data.current_player) as Color;
  const previousMove = data.previous_move
    ? toMoveAction(data.previous_move)
    : null;
  if (
    (!!currentColor && colors.indexOf(currentColor) === -1) ||
    previousMove === false
  ) {
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
    previousMove,
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
            const move = toMoveAction(d);
            if (!move) {
              invalidActions.push(d);
            } else {
              obj[color] = [...obj[color], move];
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
};

export const pieceSteps = (from: Piece, to: Piece): Piece[] => {
  if (from.area === to.area && from.index <= to.index) {
    return [...new Array(to.index - from.index)].map(i => ({
      ...from,
      index: from.index + i + 1,
    }));
  } else if (from.area === 'play') {
    let lastPlayIndex: number | null = null;
    if (to.area === 'play') {
      lastPlayIndex = 23;
    } else if (to.area === 'goal') {
      switch (from.color) {
        case 'red':
          lastPlayIndex = 23;
        case 'blue':
          lastPlayIndex = 5;
          break;
        case 'yellow':
          lastPlayIndex = 11;
          break;
        case 'green':
          lastPlayIndex = 17;
          break;
        default:
      }
    }
    if (lastPlayIndex !== null) {
      const firstPart = [...new Array(lastPlayIndex - from.index)].map(i => ({
        ...from,
        index: from.index + i + 1,
      }));
      const secondPart = [...new Array(to.index)].map(i => ({
        ...from,
        index: i,
      }));
      return [...firstPart, ...secondPart];
    }
  }
  return [to];
};
