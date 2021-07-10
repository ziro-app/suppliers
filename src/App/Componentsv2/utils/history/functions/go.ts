/* eslint no-restricted-globals: "off" */

/**
 * Go method definition - Api History @see https://developer.mozilla.org/en-US/docs/Web/API/History/go
 */
export const go = (position?: number) => {
  if (!position) return location.reload()
  return history.go(position)
}
