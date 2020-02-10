import React from 'react'
import PropTypes from 'prop-types'
import routeMatcher from '@ziro/router'
import Login from './Login/index'
import Register from './Register/index'
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble'
import ResendEmail from './ResendEmail/index'
import ResetPass from './ResetPass/index'
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email'
import { Menu } from './Menu/index'
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account'
import UpdateEmail from './UpdateEmail/index'
import UpdatePass from './UpdatePass/index'
import DeleteAccount from './DeleteAccount/index'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'

const Router = ({ isLogged }) => {
	const publicRoutes = {
		'/login': <Login />,
		'/cadastrar': <Register />,
		'/problemas-acesso': <LoginTrouble />,
		'/reenviar-email': <ResendEmail />,
		'/resetar-senha': <ResetPass />,
		'/confirmar-email': <ConfirmEmail />
	}
	const privateRoutes = { // Menu can't be put inside the components because then it'll unmount on transition
		'/conta': <Menu title='Minha Conta'><MyAccount /></Menu>,
		'/trocar-email': <UpdateEmail />,
		'/trocar-senha': <UpdatePass />,
		'/deletar-conta': <DeleteAccount />
	}
	const homeRoute = '/conta'
	return routeMatcher(isLogged, publicRoutes, privateRoutes, homeRoute, <NotFound fallback='/' />)
}

Router.propTypes = {
	isLogged: PropTypes.bool.isRequired
}

export default Router