import { useContext, useEffect, useState } from 'react';
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal"

import fetchRates from '../utils/fetchRates'
import { userContext } from '../../appContext'

const useGetRates = () => {
    const [blockDetails, setBlockDetails] = useState([])
    const [dataRows, setDataRows] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState(false)
    
    const setMessage = useMessage();
    const { zoopId } = useContext(userContext);

    const brands = [
        'mastercard',
        'visa',
        'elo',
        'americanexpress',
        'hipercard'
    ]
    
    useEffect(() => {
        fetchRates(
            zoopId,
            setLoading,
            setError,
            setDataRows,
            brands,
            setBlockDetails,
            setMessage
        )
    }, [])

    return {
        blockDetails,
        dataRows,
        isLoading,
        isError
    }
}

export default useGetRates