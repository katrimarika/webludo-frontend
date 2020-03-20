import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { setHash } from '../utils/hash';
import { Socket } from '../utils/socket';

const LobbyPage: FunctionalComponent<{ socket: Socket }> = ({ socket }) => {
  const [inputText, setInputText] = useState('');

  return (
    <div>
      <h1>Lobby</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (inputText && socket) {
            setHash(inputText);
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
          disabled={!socket}
          onClick={() =>
            socket
              ? socket.create(id => {
                  if (id && typeof id === 'string') {
                    setHash(id);
                  }
                })
              : null
          }
        >
          New game
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
