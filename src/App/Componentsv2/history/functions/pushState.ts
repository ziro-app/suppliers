/* eslint no-restricted-globals: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { printHistoryError } from "./printError"
/**
 * PushState method definition - Api History @see https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
 */
export const pushState = (state: Record<string, any>, title: string, url: string) => {
  try {
    history.pushState(state, title, url)
  } catch (error) {
    printHistoryError(error)
  }
}
