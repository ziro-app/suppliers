import React, { useState, useMemo, useEffect } from "react"
import { createFactory } from "@bit/ziro.utils.component-state"
import useDeviceSize from "@bit/ziro.utils.use-device-size"
import Icon from "@bit/ziro.views.icon2"
import IconText from "@bit/ziro.views.icon-text"
import { motion } from "framer-motion"
import { filterOptions, handleBlur, onKeyPress } from "../utils/functionsInputDropdown"
import { InputDropdownProps } from "../types"
import {
  container,
  close,
  modal,
  data,
  defaultInputStyle,
  errorContainer,
  errorText,
  errorIcon,
} from "../utils/stylesInputDropdown"
import { initial, animate, transition } from "../utils/animations"

const _InputDropdown = (globalState?: any) => {
  const InputDropdown = ({
    value,
    setValue,
    list,
    readOnly = true,
    inputName,
    isLoading = false,
    isDisabled = false,
    placeholder,
    inputError,
    styleErrorIcon,
    styleErrorText,
    style,
    ...props
  }: InputDropdownProps) => {
    if (globalState) {
      const { useState: gState } = globalState
      var [globalValue, setGlobalValue] = gState()
    }

    const [isOpen, setIsOpen] = useState(false)
    const [arrowDown, setArrowDown] = useState(false)
    const [arrowUp, setArrowUp] = useState(false)
    const [enter, setEnter] = useState(false)
    const [cursorPosition, setCursorPosition] = useState<number>(0)
    const [options, setOptions] = useState<string[] | undefined>([])
    const handleKeyPress = useMemo(() => onKeyPress(setEnter, setArrowDown, setArrowUp), [])
    const deviceSize = useDeviceSize()
    const isMobile = deviceSize === "smallMobile" || deviceSize === "mobile"
    const disabled = isLoading || isDisabled

    useEffect(() => {
      if (globalState) setOptions(readOnly ? list : filterOptions(list, setCursorPosition, globalValue.userInput))
      else setOptions(readOnly ? list : filterOptions(list, setCursorPosition, value))
    }, [readOnly, list, value, globalValue])

    useEffect(() => {
      if (isOpen && !isMobile) {
        document.body.style.overflow = "hidden" // prevents scroll
        window.addEventListener("keydown", handleKeyPress) // adds keyboard listener
      } else {
        document.body.style.overflow = "initial" // enables scroll
        window.removeEventListener("keydown", handleKeyPress) // removes keyboard listener
      }
      setCursorPosition(-1)
      setEnter(false)
    }, [isOpen, handleKeyPress, isMobile])

    useEffect(() => {
      if (isOpen) {
        const maxPosition = options !== undefined && Number(options.length) - 1
        if (arrowDown) {
          setCursorPosition(prevPosition => {
            if (prevPosition === -1) return 0
            if (prevPosition < maxPosition) return Number(prevPosition) + 1
            return Number(prevPosition)
          })
          setArrowDown(false)
        }
        if (arrowUp) {
          setCursorPosition(prevPosition => {
            if (Number(prevPosition) > 0) return Number(prevPosition) - 1
            return Number(prevPosition)
          })
          setArrowUp(false)
        }
        if (enter) {
          setIsOpen(false)
          if (document.activeElement !== null) (document.activeElement as HTMLElement).blur()

          const element = document.getElementById(String(cursorPosition)) as HTMLInputElement

          if (setGlobalValue && element) setGlobalValue({ userInput: element.value })
          if (setValue && element) setValue(element.value)

          setCursorPosition(-1)
          setEnter(false)
        }
      }
    }, [arrowDown, arrowUp, enter, cursorPosition, isOpen, options, setGlobalValue, setValue])

    useEffect(() => {
      if (cursorPosition) {
        const element = document.getElementById(String(cursorPosition))
        if (element) element.scrollIntoView(false)
      }
    }, [cursorPosition])

    return (
      <div style={{ ...container, ...style }}>
        {/* Input Principal */}
        <input
          type="text"
          value={globalState ? globalValue.userInput : value}
          onChange={e =>
            globalState ? setGlobalValue({ userInput: e.target.value }) : setValue && setValue(e.target.value)
          }
          onClick={() => !isOpen && setIsOpen(true)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => handleBlur(isOpen, setIsOpen, setCursorPosition)}
          style={defaultInputStyle}
          name={inputName}
          inputMode="text"
          placeholder={placeholder || "Escolha uma opção"}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />

        {/* Modal de opções */}
        {isOpen && (
          <motion.div style={modal} initial={initial} animate={animate} transition={transition}>
            {options &&
              options.map((item, index) => {
                return (
                  <input
                    style={data(cursorPosition === index)}
                    value={item}
                    onMouseDown={e =>
                      globalState
                        ? setGlobalValue({ userInput: (e.target as HTMLInputElement).value })
                        : setValue && setValue((e.target as HTMLInputElement).value)
                    }
                    key={item}
                    id={String(index)}
                    readOnly
                  />
                )
              })}
          </motion.div>
        )}

        {/* Botão "X" para limpar o input */}
        {globalState && globalValue.userInput !== "" && !isLoading && (
          <div style={close} onClick={() => !disabled && setGlobalValue({ userInput: "" })} role="button">
            <Icon featherName="X" width="12px" height="12px" strokeWidth="3px" style={{ color: "#fff" }} />
          </div>
        )}
        {value && setValue && value !== "" && !isLoading && (
          <div style={close} onClick={() => !disabled && setValue && setValue("")} role="button">
            <Icon featherName="X" width="12px" height="12px" strokeWidth="3px" style={{ color: "#fff" }} />
          </div>
        )}

        <div style={errorContainer}>
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
  return InputDropdown
}

const InputDropdownFactory = createFactory(_InputDropdown)
const InputDropdownConfig = { name: "InputDropdown", initialState: { userInput: "" } }
const InputDropdown = _InputDropdown()
export { InputDropdown, InputDropdownFactory, InputDropdownConfig }
