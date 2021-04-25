import React from "react"
import { container, dots, dot1, dot2, dot3 } from "./styles"

interface DotsLoaderProps {
  /** Cor do loader (whiteDots e blackDots contem gradiente) */
  color?: "whiteDots" | "blackDots" | string
  /** Tamanho do loader */
  size?: string
}

const DotsLoader = ({ color = "blackDots", size = "8px" }: DotsLoaderProps) => {
  return (
    <div style={container}>
      <style>
        {`
					@keyframes effect {
						0%, 20%, 80%, 100% {
              transform: scale(1);
              opacity: 0.5;
						}
						50% {
              transform: scale(1.2);
              opacity: 1;
						}
					}
				`}
      </style>
      <div style={{ ...dots(color, size), ...dot1 }} />
      <div style={{ ...dots(color, size), ...dot2 }} />
      <div style={{ ...dots(color, size), ...dot3 }} />
    </div>
  )
}

export default DotsLoader
