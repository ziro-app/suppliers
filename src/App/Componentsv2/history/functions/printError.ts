/* eslint no-console: "off" */

export const printHistoryError = (error: Error) => {
  const { message, name } = error
  if (name === "SecurityError") console.log("A url de destino deve pertencer à mesma origem da atual!")
  else if (name === "DataCloneError") console.log("O objeto state deve ser serializável e com tamanho máximo de 2MiB!")
  console.log(name, message)
}
