import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { buttonCss, theme } from '../utils/style';

const MiniForm: FunctionalComponent<{
  inputName: string;
  title?: string;
  label: string;
  buttonText: string;
  buttonColor?: Color;
  onSubmit: (v: string) => void;
}> = ({
  inputName,
  title,
  label,
  buttonText,
  buttonColor,
  onSubmit,
  children,
}) => {
  const [inputText, setInputText] = useState('');
  const id = `${inputName}-id`;

  return (
    <form
      className={css`
        margin: 0.5rem 0 1.5rem;
      `}
      onSubmit={e => {
        e.preventDefault();
        if (inputText) {
          onSubmit(inputText);
          setInputText('');
        }
      }}
    >
      {!!title && (
        <h2
          className={css`
            font-size: 1.25rem;
            margin: 0 0 1rem;
          `}
        >
          {title}
        </h2>
      )}
      <div
        className={css`
          display: flex;
          align-items: flex-end;
        `}
      >
        <div
          className={css`
            flex-grow: 1;
            max-width: 20rem;
            margin-right: 0.5rem;
          `}
        >
          <label
            htmlFor={id}
            className={css`
              display: block;
              margin-bottom: 0.5rem;
            `}
          >
            {label}
          </label>
          <input
            id={id}
            name={inputName}
            autoComplete="off"
            value={inputText}
            className={css`
              width: 100%;
              font-size: 0.9375rem;
              border: 2px solid ${theme.colors.black};
              border-radius: 3px;
              padding: 0.375rem 0.5rem 0.4375rem;
            `}
            onInput={e => setInputText(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!inputText}
          className={buttonCss(buttonColor)}
        >
          {buttonText}
        </button>
      </div>
      {children}
    </form>
  );
};

export default MiniForm;
