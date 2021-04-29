import React from "react"

import IconText from "../../IconText"
import { createFactory } from "../../componentState"

import { InputCommonProps } from "../types"
import { container, defaultInputStyle, styleTag, errorContainer, errorIcon, errorText } from "../utils/styles"

const _InputEmail = (globalState?: { useState: () => any }) => {
  const InputEmail = ({
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
          placeholder="email@email.com"
          inputMode="email"
          value={globalState ? globalValue.userInput : value}
          onChange={e =>
            globalState
              ? setGlobalValue({ userInput: e.target.value.toLowerCase().replace(/\s/g, "") })
              : setValue && setValue(e.target.value.toLowerCase().replace(/\s/g, ""))
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
  return InputEmail
}

const InputEmailFactory = createFactory(_InputEmail)
const InputEmailConfig = { name: "InputEmail", initialState: { userInput: "" } }
const InputEmail = _InputEmail()

export { InputEmail, InputEmailFactory, InputEmailConfig }
