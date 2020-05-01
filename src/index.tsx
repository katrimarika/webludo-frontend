import { injectGlobal } from 'emotion';
import { h, render } from 'preact';
import App from './ui/App';
import { theme } from './utils/style';
import { SocketProvider } from './utils/socketContext';

render(
  <SocketProvider>
    <App />
  </SocketProvider>,
  document.body,
);

// TODO: prevent double tap zoom on ios
injectGlobal`
  html {
    font-family: 'Segoe UI', Roboto, Oxygen, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${theme.colors.black};
    font-size: 16px;
    @media screen and (min-width: 600px) {
      font-size: 20px;
    }
    @media screen and (min-width: 1200px) {
      font-size: 24px;
    }
  }
  body {
    margin: 0;
    background: ${theme.colors.lightgray};
    &.noscroll {
      overflow: hidden;
    }
  }
  * {
    box-sizing: border-box;
  }
`;
