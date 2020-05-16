import { css } from 'emotion';
import { FunctionalComponent, h, Fragment } from 'preact';
import { theme } from '../utils/style';

const ChatItem: FunctionalComponent<{ item: ChatMessage }> = ({ item }) => {
  const dateTime = new Date(item.timestamp);
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  return (
    <p
      title={`${hours < 10 ? '0' : ''}${hours}:${
        minutes < 10 ? '0' : ''
      }${minutes}`}
      className={css`
        margin: 0;
        padding-bottom: 0.5rem;
        line-height: 1.3;
        font-size: 0.875rem;
        word-break: break-word;
      `}
    >
      {item.type === 'announcement' ? (
        <span
          className={css`
            color: ${theme.colors.gray};
          `}
        >
          {item.message}
        </span>
      ) : (
        <Fragment>
          <span
            className={css`
              font-weight: bold;
            `}
          >{`${item.player}: `}</span>
          <span>{item.message}</span>
        </Fragment>
      )}
    </p>
  );
};

export default ChatItem;
