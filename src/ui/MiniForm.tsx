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
  inputWidth?: 'long' | 'short';
  onSubmit: (v: string) => void;
}> = ({
  inputName,
  title,
  label,
  buttonText,
  buttonColor,
  inputWidth = 'short',
  onSubmit,
  children,
}) => {
  const [inputText, setInputText] = useState('');
  const id = `${inputName}-id`;

  return (
    <form
      className={css`
        margin: 0.6rem 0 1.2rem;
      `}
      onSubmit={e => {
        e.preventDefault();
        if (inputText) {
          onSubmit(inputText);
        }
      }}
    >
      {!!title && (
        <h2
          className={css`
            font-size: 1.2rem;
          `}
        >
          {title}
        </h2>
      )}
      <div
        className={css`
          display: flex;
          align-items: center;
        `}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          name={inputName}
          autoComplete="off"
          value={inputText}
          className={css`
            font-size: 0.9rem;
            border: 0.08rem solid ${theme.colors.black};
            border-radius: 0.15rem;
            padding: 0.4rem;
            margin: 0 0.6rem;
            width: ${inputWidth === 'short' ? '6rem' : '10rem'};
          `}
          onInput={e => setInputText(e.currentTarget.value)}
        />
        <button type="submit" className={buttonCss(buttonColor)}>
          {buttonText}
        </button>
      </div>
      {children}
    </form>
  );
};

export default MiniForm;
