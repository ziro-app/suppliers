import React from 'react'
import ResendEmail from '@bit/vitorbarbosa19.ziro.resend-email'
import sendToBackend from './sendToBackend'

export default () => <ResendEmail sendToBackend={sendToBackend} navigateTo='/problemas-acesso' />
