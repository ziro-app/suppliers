import React from "react"
import useIsomorphicLayoutEffect from "react-use/lib/useIsomorphicLayoutEffect"
import { createGlobalState } from "./createGlobalState"
import * as T from "./types"

/**
 * createFactory create a component factory with global state builtin
 * @param {T.FC} component the component that will be created by the factory
 * @returns {T.Factory} a factory function that can be called with a configuration object
 */
export function createFactory<S extends object, P>(component: T.FC<S, P>): T.Factory<S, P> {
  return (<RO extends boolean, PS extends boolean>(config: T.FCon<S, RO, PS>) => {
    const globalState = createGlobalState(config.initialState)
    const _component = component(globalState as any)
    _component.displayName = config.name
    const render: React.FC<P> = props => {
      if (config.persistState === false) {
        useIsomorphicLayoutEffect(() => {
          globalState.setState(config.initialState)
          return () => globalState.setState(undefined)
        }, [])
      }
      return React.createElement(_component, props)
    }
    render.displayName = `CreateFactory Wrapper - ${config.name}`
    const useExternalState = () => {
      const [state, setState] = globalState.useState()
      if (config.readonly) return state
      return [state, setState]
    }
    if (config.readonly)
      return {
        render,
        useState: useExternalState,
        useSubscription: globalState.useSubscription,
        getState: globalState.getState,
        subscribe: globalState.subscribe,
      }
    return {
      render,
      useState: useExternalState,
      useSubscription: globalState.useSubscription,
      getState: globalState.getState,
      setState: globalState.setState,
      subscribe: globalState.subscribe,
    }
  }) as any
}
