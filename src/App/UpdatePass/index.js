import React from 'react'
import UpdatePass from '@bit/vitorbarbosa19.ziro.update-pass'
import sendToBackend from './sendToBackend'

export default () => <UpdatePass sendToBackend={sendToBackend} navigateTo='/minha-conta' />