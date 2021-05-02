import { useHistory } from "./history"

/** A hook that returns the last route visited by the user or a default route in case of a page refresh
 *
 * @param defaultRoute the route returned in case of a page refresh
 */

export const useBackRoute = (defaultBackRoute: string) => {
  const { routes } = useHistory()
  const currentRoute = routes.slice(-1)[0].pathname
  const lastRoute = routes.slice(-2)[0].pathname
  if (lastRoute === currentRoute) return defaultBackRoute
  return lastRoute
}
