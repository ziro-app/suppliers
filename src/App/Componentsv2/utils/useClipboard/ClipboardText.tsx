import React, { forwardRef } from "react"
import { textArea } from "./styles"

/** any usado pois o react 16.12 não possui a exportação do 'ForwardedRef'
 * -> ForwardedRef<HTMLTextAreaElement>
 */
type Props = { linkToCopy: string }
type RefType = any

export const ClipboardText = forwardRef(({ linkToCopy }: Props, ref: RefType) => {
  return <textarea ref={ref} value={linkToCopy} readOnly style={textArea} />
})
