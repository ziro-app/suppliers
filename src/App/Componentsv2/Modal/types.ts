import React from "react"
import { SetStateType } from "@bit/ziro.utils.types"

export interface ModalProps {
  showModal?: boolean
  setShowModal?: SetStateType<boolean>
  showCloseButton?: boolean
  closeButtonColor?: string
  children: React.ReactNode
  styleContainer?: React.CSSProperties
}
