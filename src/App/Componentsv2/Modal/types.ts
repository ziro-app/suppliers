import React from "react"
import { MotionProps } from "framer-motion"

export interface ModalProps {
  showModal?: boolean
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
  showCloseButton?: boolean
  closeButtonColor?: string
  children: React.ReactNode
  styleContainer?: React.CSSProperties
}
