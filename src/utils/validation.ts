// Data type helpers and validation
export const colors = ['red', 'blue', 'yellow', 'green'] as const;
const areas = ['home', 'play', 'goal', 'center'] as const;

export const toStr = (val: any) => (typeof val === 'string' ? val : '');
export const toInt = (val: any) => parseInt(val, 10) || 0;

const toPiece = (data: any): Piece | false => {
  if (!data) {
    console.error('No game piece when expected');
    return false;
  }
  const id = toInt(data.id);
  const area = toStr(data.area) as Piece['area'];
  const index = toInt(data.position_index);
  const color = toStr(data.team_color) as Color;
  const multiplier = toInt(data.multiplier);
  if (
    !id ||
    areas.indexOf(area) === -1 ||
    colors.indexOf(color) === -1 ||
    !multiplier
  ) {
    console.error('Invalid game piece', data);
    return false;
  }
  return { id, area, index, color, multiplier };
};

const toMoveAction = (data: any): MoveAction | false => {
  if (!data) {
    console.error('No move action when expected');
    return false;
  }
  const pieceId = toInt(data.piece_id);
  const index = toInt(data.target_index);
  const area = toStr(data.target_area) as Piece['area'];
  const type = toStr(data.type) as MoveAction['type'];
  if (
    !pieceId ||
    areas.indexOf(area) === -1 ||
    ['move', 'raise'].indexOf(type) === -1
  ) {
    console.error('Invalid move action', data);
    return false;
  } else {
    return { pieceId, area, index, type };
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
const toMoveAnimation = (data: any): MoveAnimation | false => {
  if (!data) {
    console.error('No move animation when expected');
    return false;
  }
  const pieceId = toInt(data.piece_id);
  const startIndex = toInt(data.start_index);
  const startArea = toStr(data.start_area) as Piece['area'];
  const startMultiplier = toInt(data.start_multiplier);
  const targetIndex = toInt(data.target_index);
  const targetArea = toStr(data.target_area) as Piece['area'];
  const targetMultiplier = toInt(data.target_multiplier);
  if (
    !pieceId ||
    areas.indexOf(startArea) === -1 ||
    areas.indexOf(targetArea) === -1
  ) {
    console.error(`Invalid move animation`, data);
    return false;
  } else {
    return {
      pieceId,
      startIndex,
      startArea,
      startMultiplier,
      targetIndex,
      targetArea,
      targetMultiplier,
    };
  }
};
const toDoubledAnimation = (data: any): DoubledAnimation | false => {
  if (!data) {
    console.error('No doubled animation when expected');
    return false;
  }
  const pieceId = toInt(data.piece_id);
  const multiplier = toInt(data.multiplier);
  if (!pieceId || !multiplier) {
    console.error(`Invalid doubled animation`, data);
    return false;
  }
  return { pieceId, multiplier };
};

export const toGame = (data: any): Game | false => {
  if (!data) {
    console.error('No game details when expected');
    return false;
  }
  const code = toStr(data.code);
  const name = toStr(data.name);
  if (
    !code ||
    !name ||
    !Array.isArray(data.players) ||
    !Array.isArray(data.teams)
  ) {
    console.error('Invalid game details', data);
    return false;
  }

  const invalidPlayers: any[] = [];
  const players = (data.players as any[]).reduce<Player[]>((list, p) => {
    const id = toInt(p.id);
    const name = toStr(p.name);
    const teamId = toInt(p.team_id) || null;
    const donePenalties = toInt(p.completed_penalties);
    if (id && name) {
      list.push({ id, name, teamId, donePenalties });
    } else {
      invalidPlayers.push(p);
    }
    return list;
  }, []);
  if (invalidPlayers.length) {
    console.error('Invalid game players', invalidPlayers);
    return false;
  }

  let invalidTeams: any[] = [];
  const teams = (data.teams as any[]).reduce<Team[]>((list, p) => {
    const id = toInt(p.id);
    const name = toStr(p.name) || undefined;
    const color = p.color === 'none' ? null : (toStr(p.color) as Color);
    const penalties = toInt(p.penalties);
    const canRaise = !!p.can_raise;
    const newRaiseRound = !!p.new_raising_round;
    if (id && (!color || colors.indexOf(color) !== -1)) {
      list.push({ id, name, color, penalties, canRaise, newRaiseRound });
    } else {
      invalidTeams.push(p);
    }
    return list;
  }, []);
  if (invalidTeams.length) {
    console.error('Invalid game teams', invalidTeams);
    return false;
  }

  const currentColor =
    data.current_team === 'none' ? null : (toStr(data.current_team) as Color);
  if (!!currentColor && colors.indexOf(currentColor) === -1) {
    console.error('Invalid game current color', data);
    return false;
  }

  const invalidPieces: any[] = [];
  const piecesInGoal0 = { red: 0, green: 0, blue: 0, yellow: 0 };
  const pieces = Array.isArray(data.pieces)
    ? (data.pieces as any[]).reduce<Piece[]>((list, p) => {
        const piece = toPiece(p);
        if (!piece) {
          invalidPieces.push(p);
        } else {
          if (piece.area === 'goal' && piece.index === 0) {
            piece.goal0 = piecesInGoal0[piece.color];
            piecesInGoal0[piece.color] += 1;
          }
          list.push(piece);
        }
        return list;
      }, [])
    : [];
  if (invalidPieces.length) {
    return false;
  }

  return {
    code,
    name,
    players,
    teams,
    currentColor,
    pieces,
    newRaiseRound: !teams.some(t => t.canRaise),
    canBeStarted: !!data.can_be_started,
    hasStarted: !!data.has_started,
  };
};

export const toChanges = (data: any): Changes | false => {
  if (!data) {
    return {
      move: null,
      doubled: null,
      effects: [],
    };
  }
  const move = data.move ? toMoveAnimation(data.move) : null;
  const doubled = data.doubled ? toDoubledAnimation(data.doubled) : null;
  const invalidEffects: any[] = [];
  const effects = data.animated_effects
    ? Array.isArray(data.animated_effects)
      ? (data.animated_effects as any[]).reduce<MoveAnimation[]>((list, e) => {
          const eat = toMoveAnimation(e);
          if (eat) {
            list.push(eat);
          } else {
            invalidEffects.push(e);
          }
          return list;
        }, [])
      : false
    : [];
  if (
    move === false ||
    doubled === false ||
    effects === false ||
    invalidEffects.length
  ) {
    console.error('Invalid game changes', data);
    return false;
  }
  // Do not animate doubled changes above multiplier 2
  const animatedDoubled = doubled && doubled.multiplier > 2 ? null : doubled;
  return { move, doubled: animatedDoubled, effects };
};

export const toChatMessage = (
  type: ChatMessage['type'],
  data: any,
): ChatMessage | false => {
  if (!data) {
    console.error(
      `No ${
        type === 'announcement' ? 'announcement' : 'chat message'
      } when expected`,
    );
    return false;
  }
  const message = toStr(data.message);
  const timestamp = new Date(data.timestamp).getTime();
  if (type === 'announcement') {
    if (!message || !timestamp) {
      console.error('Invalid annoucement data', data);
      return false;
    }
    return { type, message, timestamp };
  } else if (type === 'message') {
    const player = toStr(data.player);
    if (!player || !message || !timestamp) {
      console.error('Invalid chat message data', data);
      return false;
    }
    return { type, player, message, timestamp };
  }
  return false;
};
