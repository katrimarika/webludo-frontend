import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { SocketActions } from '../utils/socket';

const LobbyPage: FunctionalComponent<{ socket: SocketActions }> = ({
  socket,
}) => {
  const [inputText, setInputText] = useState('');

  return (
    <div>
      <h1>Lobby</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (inputText) {
            location.hash = `#${inputText}`;
          }
        }}
      >
        <label>Open game: </label>
        <input
          name="game-id"
          autoComplete="off"
          value={inputText}
          onInput={e => setInputText(e.currentTarget.value)}
        />
        <button type="submit">Open</button>
      </form>
      <br />
      <div>
        <button
          type="button"
          onClick={() =>
            socket.create(id => {
              if (id && typeof id === 'string') {
                location.hash = `#${inputText}`;
              }
            })
          }
        >
          New game
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
