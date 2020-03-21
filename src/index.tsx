import { injectGlobal } from 'emotion';
import { h, render } from 'preact';
import App from './ui/App';
import { theme } from './utils/style';

render(<App />, document.body);

injectGlobal`
  html {
    font-family: 'Segoe UI', Roboto, Oxygen, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${theme.colors.black};
    font-size: 4vw;
    @media screen and (orientation: landscape) {
      font-size: 4vh;
    }
  }
  body {
    margin: 0;
    font-size: 1rem;
  }
`;
