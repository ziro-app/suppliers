/* eslint-disable no-console */
import { useState, RefObject, MouseEvent } from "react"

const useClipboard = (textAreaRef: RefObject<HTMLTextAreaElement>) => {
  const [message, setMessage] = useState({ title: "", body: "" })
  const clipboardCopy = (event: MouseEvent) => {
    event.preventDefault()
    if (document.queryCommandSupported("copy")) {
      try {
        textAreaRef.current?.select()
        document.execCommand("copy")
        setMessage({ title: "Link copiado com sucesso", body: "Você já pode compartilhá-lo via Whatsapp" })
      } catch (error) {
        console.log(error)
        setMessage({
          title: "Erro ao copiar link",
          body: "Não foi possível copiar o link. Mas você pode copiá-lo manualmente",
        })
      }
    } else {
      setMessage({
        title: "Navegador sem suporte",
        body: "Seu navegador não tem suporte para cópia de links. Mas você pode copiar manualmente",
      })
    }
  }
  return { message, clipboardCopy }
}

export default useClipboard
