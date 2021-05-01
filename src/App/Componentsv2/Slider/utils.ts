import { SyntheticEvent } from "react"

export const onDrag = (setPreventClick: (s: boolean) => void) => (event: PointerEvent) => {
  if (event.pointerType === "mouse") setPreventClick(true)
}

export const handleClickChildren = (preventClick: boolean, setPreventClick: (s: boolean) => void) => (
  event: MouseEvent,
  onClick: (e: MouseEvent) => void,
) => {
  if (preventClick) setPreventClick(false)
  else onClick(event)
}

export const onDragStartChildren = (event: SyntheticEvent) => event.preventDefault()
