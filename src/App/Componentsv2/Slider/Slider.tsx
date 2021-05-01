import React, { useState, useRef, cloneElement } from "react"
import useSize from "../useSize"
import { motion } from "framer-motion"
import { container, slider } from "./styles"
import { onDrag, handleClickChildren as handleClick, onDragStartChildren as onDragStart } from "./utils"

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** conteudo do slider */
  children: React.ReactElement
  /** estilo customizado do container */
  style?: React.CSSProperties
  /** estilo customizado do slider (motion.div) */
  styleSlider?: React.CSSProperties
}

const Slider = ({ children, style, styleSlider }: SliderProps) => {
  /** state to prevent triggering a click on mouse down after grabbing the slider */
  const [preventClick, setPreventClick] = useState(false)
  /** get sizes for slider and its parent container to adjust the animation constraints */
  const sliderRef = useRef(null)
  const { width: sliderWidth, x: sliderXPosition } = useSize(sliderRef)
  /** line below makes sure the animation constraints fit nicely to the width of the parent element */
  const sliderParentRef = ((sliderRef?.current as unknown) as HTMLElement)?.parentNode as HTMLElement
  const { width: bodyWidth } = useSize(sliderParentRef || document.body)
  const sliderViewPort = bodyWidth - sliderXPosition
  const leftConstraint = sliderWidth - sliderViewPort
  /** line below disables drag when there aren't enough items to fill the parent container width */
  const drag = leftConstraint <= 0 ? undefined : "x"
  return (
    <div style={{ ...container, ...style }}>
      <motion.div
        ref={sliderRef}
        drag={drag}
        dragElastic={0}
        dragConstraints={{ left: -leftConstraint, right: 0 }}
        dragTransition={{ power: 0.4, bounceStiffness: 500, bounceDamping: 90, timeConstant: 400 }}
        whileTap={{ cursor: "grabbing" }}
        onDrag={onDrag(setPreventClick)}
        style={{ ...slider(drag), ...styleSlider }}
      >
        {cloneElement(children, {
          handleClick: handleClick(preventClick, setPreventClick),
          onDragStart,
        })}
      </motion.div>
    </div>
  )
}

export default Slider
