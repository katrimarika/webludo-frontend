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
    colors.indexOf(color) === -1
  ) {
    return false;
  }
  return { id, area, index, color };
};

const toMoveAction = (data: any, from = false): MoveAction | false => {
  if (!data) {
    return false;
  }
  const pieceId = toInt(data.piece_id);
  const index = toInt(from ? data.start_index : data.target_index);
  const area = toStr(
    from ? data.start_area : data.target_area,
  ) as Piece['area'];
  if (!pieceId || ['home', 'play', 'goal'].indexOf(area) === -1) {
    return false;
  } else {
    return { pieceId, area, index };
  }
};
export const toMoveActions = (data: any): MoveAction[] | false => {
  if (!data || !Array.isArray(data)) {
    console.error('No actions array when expected');
    return false;
  }
  const invalidActions: any[] = [];
  const actions = data.reduce<MoveAction[]>((list, a) => {
    const action = toMoveAction(a);
    if (!action) {
      invalidActions.push(a);
    } else {
      list.push(action);
    }
    return list;
  }, []);
  if (invalidActions.length) {
    console.error('Invalid actions', invalidActions);
    return false;
  }
  return actions;
};

export const toGameState = (
  data: any,
  previousMoveData?: any,
): GameState | false => {
  if (!data) {
    console.error('No game state when expected');
    return false;
  }
  const currentColor = toStr(data.current_player) as Color;
  const previousMove = previousMoveData
    ? toMoveAction(previousMoveData, true)
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
