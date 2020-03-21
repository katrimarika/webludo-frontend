import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { buttonCss, theme } from '../utils/style';

const MiniForm: FunctionalComponent<{
  name: string;
  label: string;
  buttonText: string;
  buttonColor?: Color;
  onSubmit: (v: string) => void;
}> = ({ name, label, buttonText, buttonColor, onSubmit }) => {
  const [inputText, setInputText] = useState('');
  const id = `${name}-id`;

  return (
    <form
      className={css`
        margin: 0.6rem 0 1.2rem;
        display: flex;
        align-items: center;
      `}
      onSubmit={e => {
        e.preventDefault();
        if (inputText) {
          onSubmit(inputText);
        }
      }}
    >
      <label htmlFor={id}>{`${label}:`}</label>
      <input
        id={id}
        name={name}
        autoComplete="off"
        value={inputText}
        className={css`
          font-size: 0.9rem;
          border: 0.08rem solid ${theme.colors.black};
          border-radius: 0.15rem;
          padding: 0.4rem;
          margin: 0 0.6rem;
          width: 6rem;
        `}
        onInput={e => setInputText(e.currentTarget.value)}
      />
      <button type="submit" className={buttonCss(buttonColor)}>
        {buttonText}
      </button>
    </form>
  );
};

export default MiniForm;
