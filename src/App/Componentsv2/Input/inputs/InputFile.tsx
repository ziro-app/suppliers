import React, { useState } from "react"
import { motion } from "framer-motion"

import Text from "../../Text"
import IconText from "../../IconText"
import { createFactory } from "../../componentState"

import { InputCommonProps } from "../types"
import { container, styleTag, errorContainer, errorIcon, errorText } from "../utils/styles"
import { dropzone, text, button, buttonDisabled, input } from "../utils/stylesInputFile"
import { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleChange } from "../utils/functionsInputFile"

const _InputFile = (globalState?: { useState: () => any }) => {
  const InputFile = ({
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
  }: InputCommonProps<File[]>) => {
    if (globalState) {
      const { useState: gState } = globalState
      var [globalValue, setGlobalValue] = gState()
    }
    /** check if dropzone has been entered */
    const [enter, setEnter] = useState(false)
    /** check if component is on disabled state */
    const _disabled = isDisabled || isLoading
    /** display to user some feedback about the selected files */
    const files = globalState ? globalValue.userInput : value
    const notZero = files && files.length > 0
    const firstFileName = notZero ? files[0].name : ""
    const totalFileCount = notZero ? files.length : ""
    const selectedOne = notZero ? firstFileName : ""
    const selectedMoreThanOne = notZero ? `${firstFileName} e mais ${totalFileCount - 1}` : ""
    const selected = files && files.length === 1 ? selectedOne : selectedMoreThanOne
    return (
      <div style={container}>
        <style>{styleTag}</style>
        <label
          htmlFor="input-file"
          onDragEnter={handleDragEnter(setEnter)}
          onDragLeave={handleDragLeave(setEnter)}
          onDragOver={handleDragOver}
          onDrop={handleDrop(setEnter, _disabled, globalState, setGlobalValue, setValue)}
          onChange={handleChange(_disabled, globalState, setGlobalValue, setValue)}
          style={dropzone(enter, _disabled)}
        >
          <Text style={text}>{selected || "Arraste ou escolha do dispositivo"}</Text>
          <motion.div
            style={_disabled ? buttonDisabled : button(enter)}
            whileTap={_disabled ? { scale: 1 } : { scale: 0.95 }}
          >
            Escolher
          </motion.div>
          <input
            type="file"
            id="input-file"
            name={inputName}
            multiple
            disabled={_disabled}
            style={{ ...input, ...style }}
            {...props}
          />
        </label>

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
  return InputFile
}

const InputFileFactory = createFactory(_InputFile)
const InputFileConfig = { name: "InputFile", initialState: { userInput: "" } }
const InputFile = _InputFile()

export { InputFile, InputFileFactory, InputFileConfig }
