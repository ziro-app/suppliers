/* eslint-disable no-console */
import { back } from "@bit/ziro.utils.history"

export const historyBack = () => {
  try {
    /** prevent default scroll restoration */
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    /** call browser back */
    back()
  } catch (error) {
    console.log(error)
  }
}
