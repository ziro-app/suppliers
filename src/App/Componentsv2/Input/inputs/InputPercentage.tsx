import React from "react"

import IconText from "../../IconText"
import { createFactory } from "../../componentState"
import { integerToPercentage, percentageToInteger } from "../../stringFormatter"

import { InputCommonProps } from "../types"
import { container, defaultInputStyle, styleTag, errorContainer, errorIcon, errorText } from "../utils/styles"

const _InputPercentage = (globalState?: { useState: () => any }) => {
  const InputPercentage = ({
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
          placeholder="%23,32"
          inputMode="numeric"
          value={globalState ? integerToPercentage(globalValue.userInput) : value && integerToPercentage(value)}
          onChange={e =>
            globalState
              ? setGlobalValue({ userInput: percentageToInteger(e.target.value) })
              : setValue && setValue(percentageToInteger(e.target.value))
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
  return InputPercentage
}

const InputPercentageFactory = createFactory(_InputPercentage)
const InputPercentageConfig = { name: "InputPercentage", initialState: { userInput: "" } }
const InputPercentage = _InputPercentage()
export { InputPercentage, InputPercentageFactory, InputPercentageConfig }
