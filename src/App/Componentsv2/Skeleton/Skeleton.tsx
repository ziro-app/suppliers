import React, { ReactNode, CSSProperties } from "react"
import ReactSkeleton from "react-loading-skeleton"

interface SkeletonIsCircle {
  /** Quantidade de containers renderizados */
  count?: number
  /** Duração da animação */
  duration?: number
  /** Largura do container, obrigatório se circle = true */
  width: string | number
  /** Altura do container, obrigatório se circle = true */
  height: string | number
  /** Se o container tem forma de círculo */
  circle: true
  /** Componente que envelopa o container */
  wrapper?: ReactNode
  /** Estilo customizado */
  style?: CSSProperties
  /** Classe de um unico container */
  className?: string
}
interface SkeletonIsNotCircle {
  /** Quantidade de containers renderizados */
  count?: number
  /** Duração da animação */
  duration?: number
  /** Largura do container, obrigatório se circle = true */
  width?: string | number
  /** Altura do container, obrigatório se circle = true */
  height?: string | number
  /** Se o container tem forma de círculo */
  circle?: false
  /** Componente que envelopa o container */
  wrapper?: ReactNode
  /** Estilo customizado */
  style?: CSSProperties
  /** Classe de um unico container */
  className?: string
}

type SkeletonProps = SkeletonIsCircle | SkeletonIsNotCircle

const Skeleton = ({ ...props }: SkeletonProps) => <ReactSkeleton {...props} />

export default Skeleton
