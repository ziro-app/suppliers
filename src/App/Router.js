import React, { useContext, useState } from 'react';
import { useLocation, useRoute } from 'wouter';

import Collaborators from './Collaborators/index';
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email';
import CreatePayment from './CreatePayment/index';
import DeleteAccount from './DeleteAccount/index';
import GerarBoleto from './GerarBoleto/index';
import { HeaderBack } from './HeaderBack/index';
import InviteCollaborator from './InviteCollaborator/index';
import Login from './Login/index';
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble';
import { Menu } from './Menu/index';
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account';
import NotFound from '@bit/vitorbarbosa19.ziro.not-found';
import PropTypes from 'prop-types';
import Receipt from './Receipt/index';
import Receivables from './Receivables/index';
import Register from './Register/index';
import RegisterCollaborator from './RegisterCollaborator/index';
import ResendEmail from './ResendEmail/index';
import ResetPass from './ResetPass/index';
import Submenu from '@bit/vitorbarbosa19.ziro.submenu';
import Transactions from './Transactions/index';
import Upgrade from './Upgrade/index';
import UpdateEmail from './UpdateEmail/index';
import UpdatePass from './UpdatePass/index';
import UpdateUserInfo from './UpdateUserInfo/index';
import BackgroundCheck from './BackgroundCheck/index';
import { motion } from 'framer-motion';
import { Router2 as routeMatcher } from '@ziro/router';
import { userContext } from './appContext';

const Router = ({ isLogged }) => {
    const [match, params] = useRoute('/transacoes/:transactionId?/:receivableId?');
    const [match2, params2] = useRoute('/relatorio/:boletbankId?/:boletId?');
    const [matchReceivable, paramsReceivable] = useRoute('/recebiveis/:receivableId?');
    const [matchMyReceipt, paramsMyReceipt] = useRoute('/comprovante/:transactionId?/:receiptId?');
    const [receipt, setReceipt] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [location] = useLocation();
    const { role } = useContext(userContext);

    const publicRoutes = {
        '/': <Login />,
        '/login': <Login />,
        '/cadastrar': <Register />,
        '/problemas-acesso': <LoginTrouble navigateTo="/login" />,
        '/reenviar-email': <ResendEmail />,
        '/resetar-senha': <ResetPass />,
        '/confirmar-email': <ConfirmEmail />,
        '/cadastrar-colaborador': <RegisterCollaborator />,
    };
    const privateRoutes = {
        // Menu can't be put inside the components because then it'll unmount on transition
        '/': <Transactions {...params} />,
        '/upgrade': (
            <Menu title="Fazer Upgrade">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Upgrade />
                </motion.div>
            </Menu>
        ),
        '/minha-conta': (
            <Menu title="Minha Conta">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MyAccount />
                </motion.div>
            </Menu>
        ),
        '/login': (
            <Menu title="Minha Conta">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MyAccount />
                </motion.div>
            </Menu>
        ),
        '/trocar-email': (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <UpdateEmail />
            </motion.div>
        ),
        '/trocar-senha': (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <UpdatePass />
            </motion.div>
        ),
        '/deletar-conta': (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DeleteAccount />
            </motion.div>
        ),
        '/criar-cobranca': (
            <Menu title="Criar Cobrança">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <CreatePayment />
                </motion.div>
            </Menu>
        ),
        '/consulta': (
            <Menu title="Consultar documento">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <BackgroundCheck />
                </motion.div>
            </Menu>
        ),
        [matchReceivable ? location : null]: <Receivables {...paramsReceivable} />,
        [match2 ? location : null]: <GerarBoleto {...params2} />,
        [matchMyReceipt ? location : null]: <Receipt {...paramsMyReceipt} receipt={receipt} setReceipt={setReceipt} />,
        [match ? location : null]: <Transactions {...params} setTransactionId={setTransactionId} />,
        '/update': (
            <HeaderBack title="Atualizar informações" navigateTo="/login">
                <UpdateUserInfo />
            </HeaderBack>
        ),
    };

    if (role === '') {
        privateRoutes['/colaboradores'] = (
            <Menu title="Vendedores">
                <Collaborators />
            </Menu>
        );
        privateRoutes['/convidar-colaborador'] = (
            <HeaderBack title="Convidar Vendedor" navigateTo="/colaboradores">
                <InviteCollaborator />
            </HeaderBack>
        );
        privateRoutes['/cadastrar-colaborador'] = (
            <Menu title="Minha Conta">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MyAccount />
                </motion.div>
            </Menu>
        );
    }

    return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback="/" />);
};

Router.propTypes = {
    isLogged: PropTypes.bool.isRequired,
};

export default Router;
