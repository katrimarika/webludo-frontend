import { colors } from './validation';

// Helper functions for game position calculations
// Game starts from top left "corner" and proceeds clockwise

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

export const pieceSteps = (from: MoveAction, to: Piece): Piece[] => {
  if (from.area === to.area && from.index <= to.index) {
    return [...new Array(to.index - from.index)].map((_, i) => ({
      ...to,
      index: from.index + i + 1,
    }));
  } else if (from.area === 'play') {
    let lastPlayIndex: number | null = null;
    if (to.area === 'play') {
      lastPlayIndex = 23;
    } else if (to.area === 'goal') {
      switch (to.color) {
        case 'red':
          lastPlayIndex = 23;
          break;
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
      const firstPart = [...new Array(lastPlayIndex - from.index)].map(
        (_, i) => ({
          ...to,
          area: from.area,
          index: from.index + i + 1,
        }),
      );
      const secondPart = [...new Array(to.index)].map((_, i) => ({
        ...to,
        index: i,
      }));
      return [...firstPart, ...secondPart];
    }
  }
  return [to];
};
