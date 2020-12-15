import { useContext, useEffect, useState } from 'react';

import fetchRates from '../utils/fetchRates'
import { userContext } from '../../appContext'

const useGetRates = () => {
    const [blockDetails, setBlockDetails] = useState([])
    const [dataRows, setDataRows] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState(false)

    const { zoopId } = useContext(userContext);

    const brands = [
        'americanexpress',
        'elo',
        'hipercard',
        'mastercard',
        'visa'
    ]
    
    useEffect(() => {
        fetchRates(
            zoopId,
            setLoading,
            setError,
            setDataRows,
            brands,
            setBlockDetails,
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