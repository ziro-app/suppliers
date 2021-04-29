import React from "react"

import IconText from "../../IconText"
import { createFactory } from "../../componentState"
import { integerToPhone, phoneToInteger } from "../../stringFormatter"

import { InputCommonProps } from "../types"
import { container, defaultInputStyle, styleTag, errorContainer, errorIcon, errorText } from "../utils/styles"

const _InputPhone = (globalState?: { useState: () => any }) => {
  return ({
    inputName,
    value,
    setValue,
    isLoading = false,
    isDisabled = false,
    inputError,
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
          placeholder="(99) 99999-9999"
          inputMode="tel"
          value={globalState ? integerToPhone(globalValue.userInput) : value && integerToPhone(value)}
          onChange={e =>
            globalState
              ? setGlobalValue({ userInput: phoneToInteger(e.target.value) })
              : setValue && setValue(phoneToInteger(e.target.value))
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
}

const InputPhoneFactory = createFactory(_InputPhone)
const InputPhoneConfig = { name: "InputPhone", initialState: { userInput: "" } }
const InputPhone = _InputPhone()
export { InputPhone, InputPhoneFactory, InputPhoneConfig }
