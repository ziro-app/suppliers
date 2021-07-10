import { ReactNode, HTMLAttributes, ReactElement, CSSProperties } from "react"

type ChildrenAsFunction = (sizes: ClientRect) => ReactNode

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**  Aqui pode-se definir se o componente tem ou não uma altura mínima */
  withoutHeight?: boolean
  /**  Aqui pode-se definir se o componente tem ou não padding */
  withoutPadding?: boolean
  /** Conteudo envelopado pelo container, com suporte para o padrão 'render props' */
  children: ReactElement | ReactElement[] | ChildrenAsFunction
  /** Aqui pode-se passar estilos customizados */
  style?: CSSProperties
}
