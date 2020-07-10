import React, { useContext } from 'react'
import DeleteAccount from '@bit/vitorbarbosa19.ziro.delete-account'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'

export default () => {
    const { zoopId, role, userPos } = useContext(userContext)

    return <DeleteAccount userPos={userPos} isCollaborator={role !== ''} zoopId={zoopId} sendToBackend={sendToBackend} navigateTo='/minha-conta' />
}
