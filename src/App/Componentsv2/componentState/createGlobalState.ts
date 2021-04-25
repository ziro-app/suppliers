import React from "react"
import useEffectOnce from "react-use/lib/useEffectOnce"
import useIsomorphicLayoutEffect from "react-use/lib/useIsomorphicLayoutEffect"
import useLatest from "react-use/lib/useLatest"
import * as T from "./types"

const performAction = (action: any, prev?: any) => {
  switch (typeof action) {
    case "function":
      return { ...(prev || {}), ...(action(prev) || {}) }
    case "object": {
      if (!Array.isArray(action) && action !== null) return { ...(prev || {}), ...action }
    }
    default:
      return { ...(prev || {}) }
  }
}

type State = object | undefined

/**
 * createGlobalState creates a global state and returns a object containing five methods:
 * 1 - useState: a hook to subscribe to this global state
 * 2 - setState: imperatively set global state
 * 3 - getState: imperatively set glabal state
 * 4 - useSubscriber: perform a action when state changes
 * 5 - subscribe: imperatively subscribe to state changes
 * @param {S} initialState the initial state of the global state been created
 */
export function createGlobalState<S extends State>(initialState: S | (() => S)): T.GlobalStateReturn<S>
export function createGlobalState<S extends State = undefined>(): T.GlobalStateReturn<S | undefined>
export function createGlobalState<S extends State>(initialState?: S | (() => S)) {
  /**
   * the global store object contains the global state, the global setState method,
   * the setters array and the subscribers array
   */
  const store: T.Store<S> = {
    state: performAction(initialState),
    setState(action) {
      store.state = performAction(action)
      store.setters.forEach(setter => setter(store.state))
      store.subscribers.forEach(subscriber => subscriber(store.state))
    },
    setters: [],
    subscribers: [],
  }

  // utility functions
  const addSetter = (setter: T.Setter<S>) => {
    if (!store.setters.includes(setter)) store.setters.push(setter)
  }
  const removeSetter = (setter: T.Setter<S>) => {
    store.setters = store.setters.filter(s => s !== setter)
  }
  const addSubscriber = (subs: T.Subscriber<S>) => {
    if (!store.subscribers.includes(subs)) store.subscribers.push(subs)
  }
  const removeSubscriber = (subs: T.Subscriber<S>) => {
    store.subscribers = store.subscribers.filter(s => s !== subs)
  }
  /**
   * the useState hook subscribes a ordinary useState react hook to the global store
   */
  const useState: T.UseState<S> = () => {
    const [globalState, stateSetter] = React.useState<S>(store.state)
    useEffectOnce(() => () => removeSetter(stateSetter))
    useIsomorphicLayoutEffect(() => addSetter(stateSetter))
    return [globalState, store.setState]
  }
  /**
   * the useSubscriber hook subscribes a function to run on every state change
   */
  const useSubscription: T.UseSubscription<S> = subscriber => {
    const subs = useLatest(subscriber)
    const innerSubs = React.useRef((state: S) => subs.current(state))
    useEffectOnce(() => () => removeSubscriber(innerSubs.current))
    useIsomorphicLayoutEffect(() => addSubscriber(innerSubs.current))
  }
  /**
   * the setState method sets the global state imperatively
   */
  const setState: T.SetState<S> = store.setState
  /**
   * the getState method returns the global state imperatively
   */
  const getState: T.GetState<S> = () => store.state
  /**
   * the subscribe method subscribes to every state change
   */
  const subscribe: T.Subscribe<S> = subscriber => {
    addSubscriber(subscriber)
    return () => removeSubscriber(subscriber)
  }
  return { useState, setState, getState, useSubscription, subscribe }
}
