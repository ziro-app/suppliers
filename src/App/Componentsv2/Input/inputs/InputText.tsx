import React from 'react';

import IconText from '../../IconText';
import { createFactory } from '../../componentState';

import { InputTextProps } from '../types';
import { container, defaultInputStyle, styleTag, errorContainer, errorIcon, errorText } from '../utils/styles';

const _InputText = (globalState?: { useState: () => any }) => {
  const InputText = ({
    inputType,
    inputName,
    placeholder,
    inputMode,
    value,
    setValue,
    isLoading = false,
    isDisabled = false,
    inputError,
    styleErrorIcon,
    styleErrorText,
    style,
    ...props
  }: InputTextProps) => {
    if (globalState) {
      const { useState: gState } = globalState;
      var [globalValue, setGlobalValue] = gState();
    }

    const inputStyle = {
      ...defaultInputStyle,
      ...style,
    };

    return (
      <div style={container}>
        <style>{styleTag}</style>
        <input
          type={inputType}
          name={inputName}
          placeholder={placeholder}
          inputMode={inputMode}
          value={globalState ? globalValue.userInput : value}
          onChange={e => (globalState ? setGlobalValue({ userInput: e.target.value }) : setValue && setValue(e.target.value))}
          disabled={isLoading || isDisabled}
          style={inputStyle}
          {...props}
        />
        <div style={errorContainer}>
          {inputError && (
            <>
              <IconText featherName="AlertCircle" styleIcon={{ ...errorIcon, ...styleErrorIcon }} styleText={{ ...errorText, ...styleErrorText }}>
                {inputError}
              </IconText>
            </>
          )}
        </div>
      </div>
    );
  };
  return InputText;
};

const InputTextFactory = createFactory(_InputText);
const InputTextConfig = { name: 'InputText', initialState: { userInput: '' } };
const InputText = _InputText();
export { InputText, InputTextFactory, InputTextConfig };
