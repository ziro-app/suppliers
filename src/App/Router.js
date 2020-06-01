import React from 'react'
import PropTypes from 'prop-types'
import { Router2 as routeMatcher } from '@ziro/router'
import Login from './Login/index'
import Register from './Register/index'
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble'
import ResendEmail from './ResendEmail/index'
import ResetPass from './ResetPass/index'
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email'
import { Menu } from './Menu/index'
import { HeaderBack } from './HeaderBack/index'
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account'
import UpdateEmail from './UpdateEmail/index'
import UpdatePass from './UpdatePass/index'
import DeleteAccount from './DeleteAccount/index'
import CreatePayment from './CreatePayment/index'
import Transactions from './Transactions/index'
import TestCnpj from './TestCnpj/index'
import GerarBoleto from './GerarBoleto/index'
import FirebaseMigration from './FirebaseMigration/index'
import UpdateUserInfo from './UpdateUserInfo/index'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'
import { useRoute, useLocation } from 'wouter'

const Router = ({ isLogged }) => {
    const [match, params] = useRoute('/transacoes/:transactionId?/:receivableId?')
    const [match2, params2] = useRoute('/relatorio/:boletbankId?/:boletId?')
    const [location] = useLocation()

    const publicRoutes = {
        '/': <Login />,
        '/login': <Login />,
        '/cadastrar': <Register />,
        '/problemas-acesso': <LoginTrouble navigateTo='/login' />,
        '/reenviar-email': <ResendEmail />,
        '/resetar-senha': <ResetPass />,
        '/confirmar-email': <ConfirmEmail />,
        '/teste': <TestCnpj />,
    }
    const privateRoutes = { // Menu can't be put inside the components because then it'll unmount on transition
        '/': <Transactions {...params} />,
        '/minha-conta': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/login': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/trocar-email': <UpdateEmail />,
        '/trocar-senha': <UpdatePass />,
        '/deletar-conta': <DeleteAccount />,
        '/criar-cobranca': <Menu title='Criar Cobrança'><CreatePayment /></Menu>,
        [match2 ? location : null]: <GerarBoleto {...params2} />,
        [match ? location : null]: <Transactions {...params} />,
        [match2 ? location : null]: <GenerateTicket {...params2} />,
        [match ? location : null]: <Transactions {...params} />,
        '/update': <HeaderBack title='Atualizar informações' navigateTo='/login'><UpdateUserInfo /></HeaderBack>
    }

    return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback='/' />)
}

Router.propTypes = {
    isLogged: PropTypes.bool.isRequired
}

export default Router