import React from 'react'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import { container, svg, title } from './styles'

const NotFound = ({urlBoleto}) =>
	<div style={container}>
		<div style={svg}><Illustration type='noData' /></div>
		<label style={title}>Não encontramos a imagem deste boleto</label>
		<label>Se necessário essa imagem, favor entrar em contato</label>
	</div>

export default NotFound