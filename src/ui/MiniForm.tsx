import { css } from '@emotion/css';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { theme } from '../utils/style';
import Button from './Button';

const MiniForm: FunctionalComponent<{
  inputName: string;
  title?: string;
  label?: string;
  labelledBy?: string;
  buttonText: string;
  placeholder?: string;
  initialValue?: string;
  buttonColor?: Color;
  fullWidth?: boolean;
  extraCss?: string;
  onSubmit: (v: string) => void;
}> = ({
  inputName,
  title,
  label,
  labelledBy,
  placeholder,
  initialValue,
  buttonText,
  buttonColor,
  onSubmit,
  fullWidth,
  extraCss,
  children,
}) => {
  const [inputText, setInputText] = useState(initialValue || '');
  const id = `${inputName}-id`;

  return (
    <form
      className={css`
        margin: 0.5rem 0 1.5rem;
        ${extraCss}
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
          id={`form-${title}`}
          className={css`
            font-size: 1.25rem;
            margin: 0 0 0.5rem;
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
            max-width: ${fullWidth ? 'none' : '20rem'};
            margin-right: 0.5rem;
          `}
        >
          {label && (
            <label
              htmlFor={id}
              className={css`
                display: block;
                margin-bottom: 0.5rem;
              `}
            >
              {label}
            </label>
          )}
          <input
            id={id}
            name={inputName}
            autoComplete="off"
            value={inputText}
            aria-labelledBy={labelledBy}
            placeholder={placeholder}
            className={css`
              width: 100%;
              font-size: 1rem;
              border: 2px solid ${theme.colors.black};
              border-radius: 3px;
              padding: 0.375rem 0.375rem 0.4375rem;
            `}
            onInput={e => setInputText(e.currentTarget.value)}
          />
        </div>
        <Button type="submit" disabled={!inputText} color={buttonColor}>
          {buttonText}
        </Button>
      </div>
      {children}
    </form>
  );
};

export default MiniForm;
