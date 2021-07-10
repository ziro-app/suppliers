import { SetStateType } from "@bit/ziro.utils.types"

type setCursorPositionType = SetStateType<number>
type valueType = { userInput: string } | string | undefined
type setType = SetStateType<boolean>

export const filterOptions = (options: string[], setCursorPosition: setCursorPositionType, target: valueType) => {
  setCursorPosition(-1)
  if (target && typeof target !== "string" && target.userInput !== "" && target.userInput !== undefined) {
    return options.filter(value =>
      typeof value === "string" ? value.toLowerCase().includes(target.userInput.toLowerCase()) : value,
    )
  }
  if (typeof target === "string")
    return options.filter(value =>
      typeof value === "string" ? value.toLowerCase().includes(target.toLowerCase()) : value,
    )
}

export const handleBlur = (isOpen: boolean, setIsOpen: setType, setCursorPosition: setCursorPositionType) => {
  setCursorPosition(-1)
  if (isOpen) setIsOpen(false)
}

export const onKeyPress = (setEnter: setType, setArrowDown: setType, setArrowUp: setType) => (event: KeyboardEvent) => {
  if (event.key === "ArrowDown") setArrowDown(true)
  if (event.key === "ArrowUp") setArrowUp(true)
  if (event.key === "Enter") {
    event.preventDefault() // prevent form submission if inside form tag
    setEnter(true)
  }
}
