import { useHistory } from "./history"

/** A hook that returns the last route visited by the user or a default route in case of a page refresh
 *
 * @param defaultRoute the route returned in case of a page refresh
 */

export const useBackRoute = (defaultBackRoute: string) => {
  const { routes } = useHistory()
  if (routes.length === 0) return defaultBackRoute
  /** routes below this point is an array that is never empty, so pathname never tries to read from undefined */
  const currentRoute = routes.slice(-1)[0].pathname
  const previousRoute = routes.slice(-2)[0].pathname
  if (previousRoute === currentRoute) return defaultBackRoute
  return previousRoute
}
