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
    console.error('Invalid game players', invalidPlayers);
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
    console.error('Invalid game piece', data);
    return false;
  }
  return { id, area, index, color };
};

const toMoveAction = (data: any, from = false): MoveAction | false => {
  if (!data) {
    console.error('No move action when expected');
    return false;
  }
  const pieceId = toInt(data.piece_id);
  const index = toInt(from ? data.start_index : data.target_index);
  const area = toStr(
    from ? data.start_area : data.target_area,
  ) as Piece['area'];
  if (!pieceId || ['home', 'play', 'goal'].indexOf(area) === -1) {
    console.error(`Invalid move (${from ? 'from' : 'to'}) action`, data);
    return false;
  } else {
    return { pieceId, area, index };
  }
};
export const toMoveActions = (data: any): MoveAction[] | false => {
  if (!data || !Array.isArray(data)) {
    console.error('No move actions array when expected');
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
    return false;
  }
  return actions;
};

export const toGameState = (data: any, changesData: any): GameState | false => {
  if (!data) {
    console.error('No game state when expected');
    return false;
  }
  const currentColor = toStr(data.current_player) as Color;
  if (!!currentColor && colors.indexOf(currentColor) === -1) {
    console.error('Invalid game state current color', data);
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
    return false;
  }
  const previousMove =
    changesData && changesData.previous_move
      ? toMoveAction(changesData.previous_move, true)
      : null;
  const invalidEaten: any[] = [];
  const eaten =
    changesData && changesData.eaten
      ? Array.isArray(changesData.eaten)
        ? (changesData.eaten as any[]).reduce<MoveAction[]>((list, e) => {
            const action = toMoveAction(e, true);
            if (action) {
              list.push(action);
            } else {
              invalidEaten.push(e);
            }
            return list;
          }, [])
        : false
      : [];
  if (previousMove === false || eaten === false || invalidEaten.length) {
    console.error('Invalid game state changes', data);
    return false;
  }
  return {
    currentColor: currentColor || null,
    pieces,
    changes: {
      previousMove,
      eaten,
    },
  };
};
