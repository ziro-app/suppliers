import { Dispatch, SetStateAction, DragEvent, FormEvent } from "react"

type setEnterType = Dispatch<SetStateAction<boolean>>
type dragEventType = DragEvent<HTMLLabelElement>
type changeEventType = FormEvent<HTMLLabelElement>

export const handleDragEnter = (setEnter: setEnterType) => (e: dragEventType) => {
  e.preventDefault()
  e.stopPropagation()
  setEnter(true)
}
export const handleDragLeave = (setEnter: setEnterType) => (e: dragEventType) => {
  e.preventDefault()
  e.stopPropagation()
  setEnter(false)
}
export const handleDragOver = (e: dragEventType) => {
  e.preventDefault()
  e.stopPropagation()
}
export const handleDrop = (
  setEnter: setEnterType,
  disabled: boolean,
  globalState: any,
  setGlobalValue: any,
  setValue: any,
) => (e: dragEventType) => {
  e.preventDefault()
  e.stopPropagation()
  setEnter(false)
  if (!disabled) {
    const files = Array.from(e.dataTransfer.files)
    if (globalState) setGlobalValue({ userInput: files })
    else setValue(files)
  }
}
export const handleChange = (disabled: boolean, globalState: any, setGlobalValue: any, setValue: any) => (
  e: changeEventType,
) => {
  if (!disabled) {
    const files = Array.from(((e.target as unknown) as HTMLInputElement).files || [])
    if (globalState) setGlobalValue({ userInput: files })
    else setValue(files)
  }
}
