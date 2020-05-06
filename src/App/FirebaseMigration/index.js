import React, { useState, useEffect } from 'react';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { containerWithPadding, successColor, fontTitle, fontWeightBody } from '@ziro/theme'
import fetch from './fetch'

const FirebaseMigration = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState('')

    useEffect(() => fetch(setIsLoading, setIsError, setResult), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return(
        <div style={containerWithPadding}>
            <strong style={{ textAlign: 'center', color: successColor, fontFamily: fontTitle, fontWeight: fontWeightBody, fontSize: '18px'  }} >{result}</strong>
        </div>
    )

}

export default FirebaseMigration
