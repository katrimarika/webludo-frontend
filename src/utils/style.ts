import { css, keyframes } from 'emotion';

export const theme = {
  colors: {
    red: {
      main: '#ee0000',
      text: '#b60000',
    },
    blue: {
      main: '#0046ff',
      text: '#0000b7',
    },
    yellow: {
      main: '#ffdd00',
      text: '#887600',
    },
    green: {
      main: '#008a00',
      text: '#006800',
    },
    black: '#000',
    gray: '#757575',
    silver: '#c0c0c0',
    lightgray: '#f1f1f1',
    white: '#fff',
    ivory: '#fffff0',
    boardPath: '#1f1f56',
    boardCenter: '#70b1de',
    boardCorner: '#272525',
  },
};

export const buttonCss = (color: Color = 'blue') => css`
  font-size: 0.9rem;
  border: 0.08rem solid ${theme.colors[color].main};
  border-radius: 0.2rem;
  padding: 0.4rem 0.6rem;
  color: ${theme.colors[color].text};
  box-shadow: 0.1rem 0.1rem 0.4rem 0 rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  &:not(:disabled) {
    cursor: pointer;
    &:hover,
    &:focus,
    &:active {
      box-shadow: inset 0 0 0.1rem 0.01rem ${theme.colors[color].main},
        0.15rem 0.15rem 0.4rem 0 rgba(0, 0, 0, 0.2);
    }
  }
  &:disabled {
    color: ${theme.colors.gray};
    border-color: ${theme.colors.gray};
  }
`;

export const pulseAnimation = keyframes`
from {
  opacity: 1;
}
to {
  opacity: 0.6;
}
`;
