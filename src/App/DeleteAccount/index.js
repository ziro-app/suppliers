import React, { useContext } from 'react'
import DeleteAccount from '@bit/vitorbarbosa19.ziro.delete-account'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'

export default () => {
    const { zoopId } = useContext(userContext)

    return <DeleteAccount zoopId={zoopId} sendToBackend={sendToBackend} navigateTo='/' />
}