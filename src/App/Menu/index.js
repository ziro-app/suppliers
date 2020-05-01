import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { userContext } from '../appContext'
import { auth } from '../../Firebase/index'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Drawer from '@bit/vitorbarbosa19.ziro.drawer'
import DrawerPanel from '@bit/vitorbarbosa19.ziro.drawer-panel'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import { containerWithPadding } from '@ziro/theme'

export const Menu = ({ title, children }) => {
	const [isOpen, setIsOpen] = useState(false)
	const { fname, cnpj } = useContext(userContext)
	return (
		<div style={containerWithPadding}>
			<Header type='icon' title={title} icon='menu' setIsOpen={() => setIsOpen(true)} />
			<Drawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
				<DrawerPanel
					username={fname || 'Usuário'}
					userdata={cnpj ? `CNPJ: ${cnpj}` : ''}
					options={[
						{
							path: '/login',
							onClick: () => setIsOpen(false),
							icon: <Icon type='gear' size={15} strokeWidth={2} />,
							text: 'Minha Conta'
						},
						{
							path: '/criar-cobranca',
							onClick: () => setIsOpen(false),
							icon: <Icon type='money' size={15} strokeWidth={2} />,
							text: 'Criar Cobrança'
						},
						{
							path: '/transacoes',
							onClick: () => setIsOpen(false),
							icon: <Icon type='trending' size={15} strokeWidth={2} />,
							text: 'Transações'
						},
						{
							path: '/login',
							onClick: () => auth.signOut(),
							icon: <Icon type='logout' size={15} strokeWidth={3} />,
							text: 'Sair'
						},
					]}
				/>
			</Drawer>
			{children}
		</div>
	)
}

Menu.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.arrayOf(PropTypes.element)
	]).isRequired
}