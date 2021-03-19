import React, { forwardRef } from 'react';
import { inline, styleTag } from './styles';

const InputText = forwardRef(({ name, register, identifier, style = inline, css = styleTag, disabled, submitting, defaultValue, placeholder, inputMode }, ref) => {
  const inputProps = { style, disabled: disabled || submitting, defaultValue, placeholder, inputMode };
  console.log('inputProps inside inputText', inputProps);
  return (
    <>
      <style>{css}</style>
      <input ref={register} name={`${name + identifier}`} key={`${name + identifier}`} {...inputProps} className="input-text" />
    </>
  );
});

export default InputText;
