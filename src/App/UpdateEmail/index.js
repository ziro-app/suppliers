import React, { useContext } from 'react'
import UpdateEmail from '@bit/vitorbarbosa19.ziro.update-email'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'

export default () => {
    const { userPos, zoopId } = useContext(userContext)
    return <UpdateEmail zoopId={zoopId} row={userPos} sendToBackend={sendToBackend} navigateTo='/login' />
}
