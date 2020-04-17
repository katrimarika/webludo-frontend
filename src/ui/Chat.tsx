import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';
import ChatItem from './ChatItem';
import MiniForm from './MiniForm';

const Chat: FunctionalComponent = () => {
  const { messages, postMessage, playerColor } = useGameContext();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  return (
    <div
      className={css`
        margin-top: 1rem;
      `}
    >
      <h2
        id="chat-title"
        className={css`
          font-size: 1rem;
          margin: 0.5rem 0 0.25rem;
        `}
      >
        Chat
      </h2>
      <div
        ref={containerRef}
        className={css`
          border: 1px solid ${theme.colors.black};
          background: ${theme.colors.lightestGray};
          border-radius: 0.125rem;
          padding: 0.25rem 0.375rem;
          margin-bottom: 0.5rem;
          height: 4.5rem;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          @media screen and (orientation: landscape) {
            height: 7.75rem;
          }
        `}
      >
        {messages.map((m, i) => (
          <ChatItem key={`message-${m.type}-${m.timestamp}-${i}`} item={m} />
        ))}
      </div>
      {!!playerColor && (
        <MiniForm
          inputName="chat-message"
          labelledBy="chat-title"
          placeholder="Say something..."
          buttonText="Send"
          onSubmit={postMessage}
          extraCss={css`
            margin: 0;
          `}
        />
      )}
    </div>
  );
};

export default Chat;
