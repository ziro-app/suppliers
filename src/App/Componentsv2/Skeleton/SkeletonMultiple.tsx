import React, { ReactElement, CSSProperties } from "react"

interface SkeletonMultipleProps {
  /** Quantidade de containers renderizados. Serão idênticos */
  count: number
  /** Conteudo envelopado pelo container */
  children: ReactElement | ReactElement[]
  /** Estilo customizado do container */
  styleContainer?: CSSProperties
}

const SkeletonMultiple = ({ count, children, styleContainer }: SkeletonMultipleProps) => {
  /** to display skeletons correctly, we must map over a fake array while component is loading */
  const iterator = Array.from(Array(count).keys())
  return (
    <>
      {iterator.map((index: number) => (
        <div key={index} style={styleContainer}>
          {children}
        </div>
      ))}
    </>
  )
}

export default SkeletonMultiple
