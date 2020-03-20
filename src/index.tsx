import { injectGlobal } from 'emotion';
import { h, render } from 'preact';
import App from './ui/App';

render(<App />, document.body);

injectGlobal`
  html {
    font-size: 4vw;
    @media screen and (orientation: landscape) {
      font-size: 4vh;
    }
  }
  body {
    margin: 0;
  }
`;
