/* eslint no-restricted-globals: "off" */
/* eslint no-restricted-syntax: "off" */
import React from "react"
import { useEffectOnce, useIsomorphicLayoutEffect } from "react-use"
import { HistoryFormat, RoutesFormat, StoreFormat } from "./types"

/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */
const eventPopstate = "popstate"
const eventPushState = "pushState"
const eventReplaceState = "replaceState"
export const events = [eventPopstate, eventPushState, eventReplaceState]

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof history !== "undefined") {
  for (const type of [eventPushState, eventReplaceState]) {
    const original = history[type]

    history[type] = function () {
      const result = original.apply(this, arguments)
      const event = new Event(type)
      // event.arguments = arguments;

      dispatchEvent(event)
      return result
    }
  }
}

const currentPathname = (base = "", path: string = location.pathname) =>
  !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || "/" : `~${path}`

const store: StoreFormat = {
  state: { routes: [], length: 0 },
  hash: null,
  setters: [],
  setState: (newState: RoutesFormat, event: string) => {
    if (event === "pushState") store.state.routes.push(newState)
    else if (event === "popstate") store.state.routes.pop()
    else store.state.routes.splice(store.state.length - 1, 1, newState)
    store.state.length = store.state.routes.length
    store.setters.forEach(setter => setter(store.state))
  },
}

const validTransition = (prev: RoutesFormat, current: RoutesFormat): boolean => {
  if (prev.pathname !== current.pathname) return true
  if (prev.search !== current.search) return true
  return false
}

const checkForUpdates = (e: string) => {
  const pathname = currentPathname()
  const { search } = location
  const { state } = history
  const hash = { pathname, search, state }
  if (!store.hash || validTransition(store.hash, hash)) {
    store.hash = hash
    store.setState(hash, e)
  }
}

store.hash = { pathname: currentPathname(), search: location.search }
store.setState({ pathname: currentPathname(), search: location.search, state: history.state }, "pushState")

events.forEach(e => addEventListener(e, () => checkForUpdates(e)))

/**
 * This hook creates a global state that listens for changes
 * in the route and returns an object containing this history
 */
export function useHistory(): HistoryFormat {
  const [globalState, stateSetter] = React.useState(store.state)

  useEffectOnce(() => () => {
    store.setters = store.setters.filter(setter => setter !== stateSetter)
  })

  useIsomorphicLayoutEffect(() => {
    if (!store.setters.includes(stateSetter)) {
      store.setters.push(stateSetter)
    }
  })

  return globalState
}
