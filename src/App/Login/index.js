import React from 'react'
import sendToBackend from './sendToBackend'
import LoginPage from '@bit/vitorbarbosa19.ziro.login-page'
import { containerWithPadding } from '@ziro/theme'

const Login = () =>
	<div style={containerWithPadding}>
		<LoginPage audience='<INSIRA UM NOME>' sendToBackend={sendToBackend} />
	</div>

export default Login