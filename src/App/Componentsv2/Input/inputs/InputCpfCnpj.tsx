import React from "react"

import IconText from "../../IconText"
import { createFactory } from "../../componentState"
import { integerToCpfCnpj, cpfCnpjToInteger } from "../../stringFormatter"

import { InputCommonProps } from "../types"
import { container, defaultInputStyle, styleTag, errorContainer, errorIcon, errorText } from "../utils/styles"

const _InputCpfCnpj = (globalState?: { useState: () => any }) => {
  const InputCpfCnpj = ({
    inputName,
    value,
    setValue,
    isLoading = false,
    inputError,
    isDisabled = false,
    styleErrorIcon,
    styleErrorText,
    style,
    ...props
  }: InputCommonProps<string>) => {
    if (globalState) {
      const { useState: gState } = globalState
      var [globalValue, setGlobalValue] = gState()
    }

    const inputStyle = {
      ...defaultInputStyle,
      ...style,
    }

    return (
      <div style={container}>
        <style>{styleTag}</style>
        <input
          type="text"
          name={inputName}
          placeholder="Digite a informação"
          inputMode="numeric"
          value={globalState ? integerToCpfCnpj(globalValue.userInput) : value && integerToCpfCnpj(value)}
          onChange={e =>
            globalState
              ? setGlobalValue({ userInput: cpfCnpjToInteger(e.target.value) })
              : setValue && setValue(cpfCnpjToInteger(e.target.value))
          }
          disabled={isLoading || isDisabled}
          style={inputStyle}
          {...props}
        />

        <div style={errorContainer}>
          {inputError && (
            <>
              <IconText
                featherName="AlertCircle"
                styleIcon={{ ...errorIcon, ...styleErrorIcon }}
                styleText={{ ...errorText, ...styleErrorText }}
              >
                {inputError}
              </IconText>
            </>
          )}
        </div>
      </div>
    )
  }
  return InputCpfCnpj
}

const InputCpfCnpjFactory = createFactory(_InputCpfCnpj)
const InputCpfCnpjConfig = { name: "InputCpfCnpj", initialState: { userInput: "" } }
const InputCpfCnpj = _InputCpfCnpj()
export { InputCpfCnpj, InputCpfCnpjFactory, InputCpfCnpjConfig }
