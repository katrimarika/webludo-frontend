import { injectGlobal } from 'emotion';
import { h, render } from 'preact';
import App from './ui/App';
import { theme } from './utils/style';
import { SocketProvider } from './utils/context';

render(
  <SocketProvider>
    <App />
  </SocketProvider>,
  document.body,
);

injectGlobal`
  html {
    font-family: 'Segoe UI', Roboto, Oxygen, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${theme.colors.black};
    font-size: 4vw;
    @media screen and (orientation: landscape) {
      font-size: 3vh;
    }
  }
  body {
    margin: 0;
    font-size: 1rem;
    background: ${theme.colors.lightgray};
  }
`;
