import React from "react"
import themes from "@bit/ziro.utils.themes"
import { loaderContainer, ripple, first, second } from "./styles"

interface PulseLoaderProps {
  /** Tamanho do loader */
  size?: number
  /** Cor da borda do loader */
  borderColor?: string
  /** Cor do fundo do loader */
  bgColor?: string
}

const PulseLoader = ({ size = 40, borderColor = "orange", bgColor = themes.colors.warning }: PulseLoaderProps) => {
  return (
    <div style={loaderContainer}>
      <style>
        {`
          @keyframes first-ripple {
            0% {
              width: 0;
              height: 0;
              opacity: 1;
            }
            100% {
              width: 100%;
              height: 100%;
              opacity: 0;
            }
          }
          @keyframes second-ripple {
            0% {
              width: 0;
              height: 0;
              opacity: 1;
            }
            100% {
              width: 100%;
              height: 100%;
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={ripple(size)}>
        <div style={first(borderColor, bgColor)} />
        <div style={second(borderColor, bgColor)} />
      </div>
    </div>
  )
}

export { PulseLoader }
