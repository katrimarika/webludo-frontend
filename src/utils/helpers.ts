// Helper functions for game position calculations
// Game starts from top left "corner" and proceeds clockwise

const playDist = 15;
const playStart = 90 + 45;

const toRad = (deg: number) => (deg / 360) * 2 * Math.PI;

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
