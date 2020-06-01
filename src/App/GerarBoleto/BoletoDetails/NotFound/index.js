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
			<div style={svg}><Illustration type='noData' /></div>
			<label style={title}>Não encontramos a imagem deste boleto</label>
			<label>Se necessário essa imagem, favor entrar em contato</label>
		</div>
	)
}

export default ErrorExpired