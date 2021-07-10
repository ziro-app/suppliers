import React, { HTMLAttributes, CSSProperties } from "react"
import Illustration, { IllustrationProps } from "@bit/ziro.views.illustration"
import { useLocation } from "@bit/ziro.views.router"
import Title from "@bit/ziro.views.title"
import Text from "@bit/ziro.views.text"
import Button from "@bit/ziro.views.button"
import { container, textContainer, buttonStyle } from "../styles"

interface ErrorGenericProps extends HTMLAttributes<HTMLDivElement> {
  /** route user will navigate to after clicking the button */
  fallbackRoute?: string
  /** error that the error boundary will pass as prop so the user can see it on the screen */
  error?: Error
  /** function that resets the state of the error boundary so the user can recover from the error */
  resetErrorBoundary?: (...args: Array<unknown>) => void
  /** illustration name */
  illustration?: IllustrationProps["name"]
  /** title content */
  title?: string
  /** text content */
  text?: string
  /** button content */
  button?: string
  /** custom style for main container */
  style?: CSSProperties
  /** custom style for text container */
  styleTextContainer?: CSSProperties
  /** custom style for button */
  styleButton?: CSSProperties
}

export const ErrorGeneric = ({
  fallbackRoute = "/",
  error,
  resetErrorBoundary,
  illustration = "BugFixRed",
  title = "Ocorreu um erro",
  text = "Tente novamente ou contate suporte",
  button = "Tentar novamente",
  style,
  styleTextContainer,
  styleButton,
}: ErrorGenericProps) => {
  const [, setLocation] = useLocation()
  /** either reset the error boundary (in case ErrorGeneric is the boundary's fallback component) or navigate to fallback route */
  const onClickFunction = resetErrorBoundary || (() => setLocation(fallbackRoute))
  return (
    <div style={{ ...container, ...style }}>
      <Illustration name={illustration} />
      <div style={{ ...textContainer, ...styleTextContainer }}>
        <Title>{title}</Title>
        <Text>{(error && error.message) || text}</Text>
      </div>
      <Button type="button" onClick={onClickFunction} style={{ ...buttonStyle, ...styleButton }}>
        {button}
      </Button>
    </div>
  )
}
