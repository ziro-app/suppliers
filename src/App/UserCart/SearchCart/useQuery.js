import { useCallback,useState } from 'react'
import queryString from 'querystring'
import { setQueryCallback } from '../utils'
import { useLocation } from 'wouter'

export const useQuery = () => {
    const [query,setQuery] = useState(queryString.parse(window.location.search.slice(1)))
    const [location, setLocation] = useLocation()
    const deps = [location,setLocation,setQuery]
    const setValue = (key) => useCallback(setQueryCallback(...deps,key),[...deps,key])
    return (key) => [query[key],setValue(key)]
}