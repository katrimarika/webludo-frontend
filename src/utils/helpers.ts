import { colors } from './validation';

// Helper functions for game position calculations
// Game starts from top left "corner" and proceeds clockwise

const playDist = 360 / 28; // Distance between play squares
const playStart = 90 + 45; // Starting position of the round

export const toRad = (deg: number) => (deg / 360) * 2 * Math.PI;

export const playCoord = (type: 'x' | 'y', i: number) => {
  // 28 play "squares": i = 0..27
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

export const goalCoord = (type: 'x' | 'y', i: number, j: number, extra = 0) => {
  // 4 colors: i = 0..3, 4 "squares" each: j = 0..3
  const dist = 7.5;
  const rad = toRad(playStart - 90 * i + extra * 8);
  if (type === 'x') {
    return 50 + (39 - j * dist) * Math.cos(rad);
  } else {
    return 50 - (39 - j * dist) * Math.sin(rad);
  }
};

export const centerCoord = (type: 'x' | 'y', i: number, j: number) => {
  // 4 colors: i = 0..3, 3 possible places for each color: j = 0..2
  // (max 3 pieces per color can be in center)
  const rad = toRad(playStart - 45 - 90 * i);
  if (type === 'x') {
    return 50 + 28 * Math.cos(rad) + (j === 0 ? -4 : j === 1 ? 1.5 : 2.3);
  } else {
    return 50 - 28 * Math.sin(rad) + (j === 0 ? 0.5 : j === 1 ? -3.7 : 3.2);
  }
};

export const pieceCoord = (type: 'x' | 'y', piece: Piece) => {
  const colorIndex = colors.indexOf(piece.color);
  switch (piece.area) {
    case 'goal':
      return goalCoord(type, colorIndex, piece.index, piece.goal0);
    case 'home':
      return homeCoord(type, colorIndex, piece.index);
    case 'play':
      return playCoord(type, piece.index);
    case 'center':
      return centerCoord(type, colorIndex, piece.index);
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

export const dieCoord = (
  type: 'x' | 'y',
  positionRand: number,
  distanceRand: number,
) => {
  const rad = toRad(Math.floor(positionRand * 360));
  if (type === 'x') {
    return 50 + 5 * distanceRand * Math.cos(rad);
  } else {
    return 50 - 5 * distanceRand * Math.sin(rad);
  }
};

export const pieceSteps = (piece: Piece, move: MoveAnimation): Piece[] => {
  if (
    move.startArea === move.targetArea &&
    move.startIndex <= move.targetIndex
  ) {
    return [...new Array(move.targetIndex - move.startIndex)].map((_, i) => ({
      ...piece,
      area: move.startArea,
      index: move.startIndex + i + 1,
    }));
  } else if (move.startArea === 'play') {
    let lastPlayIndex: number | null = null;
    if (move.targetArea === 'play') {
      lastPlayIndex = 27;
    } else if (move.targetArea === 'goal') {
      switch (piece.color) {
        case 'red':
          lastPlayIndex = 27;
          break;
        case 'blue':
          lastPlayIndex = 6;
          break;
        case 'yellow':
          lastPlayIndex = 13;
          break;
        case 'green':
          lastPlayIndex = 20;
          break;
        default:
      }
    }
    if (lastPlayIndex !== null) {
      const firstPart = [...new Array(lastPlayIndex - move.startIndex)].map(
        (_, i) => ({
          ...piece,
          area: move.startArea,
          index: move.startIndex + i + 1,
        }),
      );
      const secondPart = [...new Array(move.targetIndex + 1)].map((_, i) => ({
        ...piece,
        area: move.targetArea,
        index: i,
      }));
      return [...firstPart, ...secondPart];
    }
  }
  return [{ ...piece, area: move.targetArea, index: move.targetIndex }];
};
