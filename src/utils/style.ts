import { css } from 'emotion';

export const theme = {
  colors: {
    red: {
      main: '#ee0000',
      text: '#a00000',
    },
    blue: {
      main: '#0046ff',
      text: '#0000a7',
    },
    yellow: {
      main: '#ffd400',
      text: '#dab600',
    },
    green: {
      main: '#008a00',
      text: '#005800',
    },
    black: '#000',
    gray: '#757575',
    silver: '#c0c0c0',
    lightgray: '#f1f1f1',
    lightestGray: '#fafafa',
    white: '#fff',
    ivory: '#fffff0',
    highlight: '#d6e8f5',
    boardPath: '#1f1f56',
    boardCenter: '#d6e8f5',
    boardCorner: '#272525',
  },
};

export const buttonCss = (color: Color = 'blue') => css`
  font-family: inherit;
  font-size: 1rem;
  border: 2px solid ${theme.colors[color].text};
  border-radius: 4px;
  padding: 0.375rem 0.5rem 0.4375rem;
  color: ${theme.colors[color].text};
  background: ${theme.colors.white};
  box-shadow: 0.1rem 0.1rem 0.4rem 0 rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  &:not(:disabled) {
    cursor: pointer;
    &:hover,
    &:focus,
    &:active {
      box-shadow: inset 0 0 0.1rem 0.01rem ${theme.colors[color].text},
        0.15rem 0.15rem 0.4rem 0 rgba(0, 0, 0, 0.2);
    }
  }
  &:disabled {
    color: ${theme.colors.gray};
    border-color: ${theme.colors.gray};
  }
`;
