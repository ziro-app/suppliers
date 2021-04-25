import React from 'react';

import IconText from '../../IconText';
import { createFactory } from '../../componentState';
import { integerToCurrency, currencyToInteger } from '../../stringFormatter';

import { InputMoneyProps } from '../types';
import { container, defaultInputStyle, styleTag, errorContainer, errorIcon, errorText } from '../utils/styles';

const _InputMoney = (globalState?: { useState: () => any }) => {
  const InputMoney = ({ inputName, value, monetarySymbol = 'R$', setValue, isLoading = false, inputError, isDisabled = false, styleErrorIcon, styleErrorText, style, ...props }: InputMoneyProps) => {
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
          type="text"
          name={inputName}
          placeholder="R$1.299,99"
          inputMode="numeric"
          value={globalState ? integerToCurrency(globalValue.userInput) : value && integerToCurrency(value, monetarySymbol)}
          onChange={e => (globalState ? setGlobalValue({ userInput: currencyToInteger(e.target.value) }) : setValue && setValue(currencyToInteger(e.target.value)))}
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
  return InputMoney;
};

const InputMoneyFactory = createFactory(_InputMoney);
const InputMoneyConfig = { name: 'InputMoney', initialState: { userInput: '' } };
const InputMoney = _InputMoney();
export { InputMoney, InputMoneyFactory, InputMoneyConfig };
