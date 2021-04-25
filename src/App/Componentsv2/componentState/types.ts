import { Dispatch, SetStateAction } from "react"
/**
 * Create Global State types
 */
// utility types
export type PartialAction<S> = SetStateAction<Partial<S>>
export type Action<S> = SetStateAction<S>
export type Subscriber<S> = (state: S) => void
export type Setter<S> = Dispatch<Action<S>>

// function types
export type SetState<S> = Dispatch<PartialAction<S>>
export type GetState<S> = () => S
export type UseState<S> = () => any // seguir essa thread pode resolver o problema da tupla https://stackoverflow.com/questions/62079477/line-0-parsing-error-cannot-read-property-map-of-undefined
export type UseSubscription<S> = (subscriber: Subscriber<S>) => void
export type Subscribe<S> = (subscriber: Subscriber<S>) => void

// create global state return type
export interface GlobalStateReturn<S> {
  useState: UseState<S>
  setState: SetState<S>
  getState: GetState<S>
  useSubscription: UseSubscription<S>
  subscribe: Subscribe<S>
}

// create global state store
export interface Store<S> {
  state: S
  setState: SetState<S>
  setters: Setter<S>[]
  subscribers: Subscriber<S>[]
}

/**
 * Create Factory types
 */
// utility types
interface CommonReturn<S, P> {
  render: React.FC<P>
  getState: GetState<S>
  useSubscription: UseSubscription<S>
  subscribe: Subscribe<S>
}

interface ROReturn<S, P> extends CommonReturn<S, P> {
  useState: GetState<S>
}

interface RWReturn<S, P> extends CommonReturn<S, P> {
  useState: UseState<S>
  setState: SetState<S>
}

// just to reduce verbosity
type B = boolean
type F = false
type T = true
type U = undefined
type SPS<PS, S, IS> = PS extends T ? S | IS : S | U

// component factory return type
export type FR<RO extends boolean, S, P> = RO extends true ? ROReturn<S, P> : RWReturn<S, P>

// component factory config type
export interface FCon<IS, RO extends boolean, PS extends boolean> {
  name: string
  initialState?: IS
  readonly?: RO
  persistState?: PS
}

// Factory type
export type Factory<S, P> = <IS extends S | U = U, RO extends B = F, PS extends B = T>(
  config?: FCon<IS, RO, PS>,
) => FR<RO, SPS<PS, S, IS>, P>

// functional component with useState injection
export type FC<S extends object, P> = (globalState: GlobalStateReturn<S>) => React.FC<P>
