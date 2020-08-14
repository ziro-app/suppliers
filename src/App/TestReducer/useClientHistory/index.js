import {useReducer} from 'react'
import customReducer from './customReducer'

const useClientHistory = () => {
    const [linksObj, dispatch] = useReducer(customReducer, {})
    return [linksObj, dispatch]
}

export default useClientHistory