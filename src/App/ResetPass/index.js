import React from 'react'
import ResetPass from '@bit/vitorbarbosa19.ziro.reset-pass'
import sendToBackend from './sendToBackend'

export default () => <ResetPass sendToBackend={sendToBackend} navigateTo='/problemas-acesso' />
