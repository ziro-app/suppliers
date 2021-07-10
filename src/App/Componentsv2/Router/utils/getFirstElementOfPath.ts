/* eslint-disable no-useless-escape */
export const getFirstElementOfPath = (url: string) => {
  const match = url.match(/^\/[^\/]*/g)
  if (!match) return []
  return match
}
