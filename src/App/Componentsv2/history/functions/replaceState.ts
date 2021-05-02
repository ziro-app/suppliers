/* eslint no-restricted-globals: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { printHistoryError } from "./printError"
/**
 * ReplaceState method definition - Api History @see https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
 */
export const replaceState = (state: Record<string, any>, title: string, url: string) => {
  try {
    history.replaceState(state, title, url)
  } catch (error) {
    printHistoryError(error)
  }
}
