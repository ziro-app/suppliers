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
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account'
import UpdateEmail from './UpdateEmail/index'
import UpdatePass from './UpdatePass/index'
import DeleteAccount from './DeleteAccount/index'
import CreatePayment from './CreatePayment/index'
import Transactions from './Transactions/index'
import TransactionDetails from './TransactionDetails/index'
import FirebaseMigration from './FirebaseMigration/index'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'
import { useRoute, useLocation } from 'wouter'

const Router = ({ isLogged }) => {
    const [match, params] = useRoute('/transacoes/:charge?/:date?/:expectedDate?/:fees?/:installment?/:installments?/:seller?/:status?/:statusColor?')
    const [location] = useLocation()

    const publicRoutes = {
        '/': <Login />,
        '/login': <Login />,
        '/cadastrar': <Register />,
        '/problemas-acesso': <LoginTrouble navigateTo='/login' />,
        '/reenviar-email': <ResendEmail />,
        '/resetar-senha': <ResetPass />,
        '/confirmar-email': <ConfirmEmail />
    }
    const privateRoutes = { // Menu can't be put inside the components because then it'll unmount on transition
        '/': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/login': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/trocar-email': <UpdateEmail />,
        '/trocar-senha': <UpdatePass />,
        '/deletar-conta': <DeleteAccount />,
        '/criar-cobranca': <Menu title='Criar Cobrança'><CreatePayment /></Menu>,
        '/transacoes': <Menu title='Vendas'><Transactions /></Menu>,
        [match && params.charge && params.date && params.expectedDate && params.fees && params.installment
            && params.installments && params.seller && params.status && params.statusColor ? location : null]: <TransactionDetails />
        //'/migrations': <Menu title='Migrações'><FirebaseMigration /></Menu>
    }
    return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback='/' />)
}

Router.propTypes = {
    isLogged: PropTypes.bool.isRequired
}

export default Router