import React from "react"

import { createFactory } from "@bit/ziro.utils.component-state"
import IconText from "@bit/ziro.views.icon-text"

import { checkboxProps } from "../types"
import { errorContainer, errorIcon, errorText } from "../utils/styles"
import {
  toggleContainer,
  toggleButton,
  innerCircle,
  checkedSquare,
  checkboxContainer,
  resetInputStyles,
  mainContainer,
  defaultSquare,
} from "../utils/stylesInputCheckbox"
import { matchColor } from "../utils/colors"

const _InputCheckbox = (globalState?: { useState: () => any }) => {
  const InputCheckbox = ({
    inputName,
    value,
    setValue,
    isToggle = false,
    size = 50,
    template = "default",
    isLoading = false,
    isDisabled = false,
    inputError,
    styleErrorIcon,
    styleErrorText,
    style,
    styleInput,
    children,
    ...props
  }: checkboxProps) => {
    const disabled = isLoading || isDisabled
    if (globalState) {
      const { useState: gState } = globalState
      var [globalValue, setGlobalValue] = gState()
    }

    const handleActive = () => {
      if (globalState) return globalValue.userInput
      return value
    }

    const handleClick = () => {
      if (!disabled) {
        if (globalState) {
          setGlobalValue({ userInput: !globalValue.userInput })
          return handleActive
        }
        return setValue && setValue(!value)
      }
      return null
    }

    return (
      <div style={{ ...mainContainer, ...style }} {...props}>
        {
          <div style={{ ...checkboxContainer, ...styleInput }}>
            <input
              type="checkbox"
              name={inputName}
              checked={globalState ? globalValue.userInput : value}
              onChange={e =>
                globalState ? setGlobalValue({ userInput: e.target.checked }) : setValue && setValue(e.target.checked)
              }
              disabled={isLoading || isDisabled}
              style={resetInputStyles}
            />
            {isToggle && (
              <div style={toggleContainer} onClick={handleClick} role="button">
                <div style={toggleButton(size, handleActive(), matchColor[template])}>
                  <div style={innerCircle(size, handleActive())} />
                </div>
              </div>
            )}

            {/* Caixa normal */}
            {!isToggle && (
              <span
                style={defaultSquare(globalState ? globalValue.userInput : value)}
                onClick={handleClick}
                role="button"
                aria-label="Caixa do input"
              />
            )}

            {/* Caixa quando checked === true */}
            {!isToggle && ((globalState && globalValue.userInput) || (value && value)) && (
              <span style={checkedSquare} onClick={handleClick} role="button" aria-label="Caixa do input" />
            )}
            {children && children}
          </div>
        }
        {/* Espaço para mensagem de erro */}
        <div style={{ ...errorContainer }}>
          {inputError && (
            <IconText
              featherName="AlertCircle"
              styleIcon={{ ...errorIcon, ...styleErrorIcon }}
              styleText={{ ...errorText, ...styleErrorText }}
            >
              {inputError}
            </IconText>
          )}
        </div>
      </div>
    )
  }
  return InputCheckbox
}

const InputCheckboxFactory = createFactory(_InputCheckbox)
const InputCheckboxConfig = { name: "InputCheckbox", initialState: { userInput: "" } }
const InputCheckbox = _InputCheckbox()

export { InputCheckbox, InputCheckboxFactory, InputCheckboxConfig }
