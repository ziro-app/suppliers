import React from 'react'
import { useLocation } from 'wouter'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import { container,svg, title } from './styles'

const Sucesso = ({urlBoleto}) => {
	const [, setLocation] = useLocation()
	return (
		<div style={container}>
			<div style={svg}><Illustration type='paymentSuccess' /></div>
			<label style={title}>Duplicata gerada com sucesso</label>
			<Button type='link' cta='Visualizar Duplicata' navigate={async () => window.open(urlBoleto,'_blank')} />
			<Button type='link' template="light" cta='Retornar' navigate={async () => {
				await setLocation('/')
				await setLocation('/relatorio')
				}} />
		</div>
	)
}

export default Sucesso