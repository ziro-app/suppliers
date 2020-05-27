import React from 'react'
import { useLocation } from 'wouter'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import { containerWithPadding } from '@ziro/theme'
import { container,svg, title } from './styles'

const ErrorExpired = ({urlBoleto}) => {
	const [, setLocation] = useLocation()
	return (
		<div style={{...containerWithPadding, ...container}}>
			<div style={svg}><Illustration type='paymentSuccess' /></div>
			<label style={title}>Boleto gerado com sucesso!</label>
			<label>Veja mais informações sobre ele na sua timeline</label>
			<Button type='link' cta='Retornar' navigate={async () => setLocation('/')} />
			<Button type='link' cta='Link Duplicata' navigate={async () => window.open(urlBoleto,'_blank')} />
		</div>
	)
}

export default ErrorExpired