import React, { useContext, useState, Suspense } from "react"
import { useLocation, useRoute } from "wouter"

import ConfirmEmail from "@bit/vitorbarbosa19.ziro.confirm-email"
import LoginTrouble from "@bit/vitorbarbosa19.ziro.login-trouble"
import MyAccount from "@bit/vitorbarbosa19.ziro.my-account"
import NotFound from "@bit/vitorbarbosa19.ziro.not-found"
import PropTypes from "prop-types"
import SpinnerWithDiv from "@bit/vitorbarbosa19.ziro.spinner-with-div"
import { motion } from "framer-motion"
import { Router2 as routeMatcher } from "@ziro/router"
import Collaborators from "./Collaborators"
import CreatePayment from "./CreatePayment"
import DeleteAccount from "./DeleteAccount"
import GerarBoleto from "./GerarBoleto"
import Rates from "./Rates"
import UserCart from "./UserCart"
import { HeaderBack } from "./HeaderBack"
import InviteCollaborator from "./InviteCollaborator"
import Login from "./Login"
import LoginSupportPage from "./LoginSupportPage"
import MainPage from "./MainPage"
import { Menu } from "./Menu"
import Receipt from "./Receipt"
import Receivables from "./Receivables"
import Register from "./Register"
import RegisterCollaborator from "./RegisterCollaborator"
import ResendEmail from "./ResendEmail"
import ResetPass from "./ResetPass"
import Transactions from "./Transactions"
import Upgrade from "./Upgrade"
import UpdateEmail from "./UpdateEmail"
import UpdatePass from "./UpdatePass"
import UpdateUserInfo from "./UpdateUserInfo"
import BackgroundCheck from "./BackgroundCheck"
import BankInfo from "./BankInfo"
import Preferences from "./Preferences"
import CheckoutBackgroundCheck from "./CheckoutBackgroundCheck"
import AboutCredits from "./AboutCredits"
import Productsv2 from "./Productsv2"
import { userContext } from "./appContext"

const Router = ({ isLogged }) => {
  const [matchCart, paramsCart] = useRoute("/pedidos/:cartId?")
  // const [matchUploadForCart, paramsUploadForCart] = useRoute("/produtos/adicionar/:cartId?")
  const [match, params] = useRoute("/transacoes/:transactionId?/:receivableId?")
  const [match2, params2] = useRoute("/relatorio/:boletbankId?/:boletId?")
  const [matchReceivable, paramsReceivable] = useRoute("/recebiveis/:receivableId?")
  const [matchMyReceipt, paramsMyReceipt] = useRoute("/comprovante/:transactionId?/:receiptId?")
  const [matchBuyCreditBackgroundCheck, paramsBuyCreditBackgroundCheck] = useRoute("/comprar-consulta/cartao/:quantity")
  const [matchProductsRoot] = useRoute("/produtos")
  const [matchProductsNew] = useRoute("/produtos/novo")
  const [matchProductsEdit] = useRoute("/produtos/:productId/editar")
  const [receipt, setReceipt] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [location] = useLocation()
  const { role } = useContext(userContext)
  const currentBackRoute = localStorage.getItem("voltar")

  const publicRoutes = {
    "/": <Login />,
    "/login": <Login />,
    "/cadastrar": <Register />,
    "/problemas-acesso": <LoginTrouble navigateTo="/login" />,
    "/pagina-suporte": <LoginSupportPage />,
    "/reenviar-email": <ResendEmail />,
    "/resetar-senha": <ResetPass />,
    "/confirmar-email": <ConfirmEmail />,
    "/cadastrar-colaborador": <RegisterCollaborator />,
  }
  const privateRoutes = {
    // Menu can't be put inside the components because then it'll unmount on transition
    "/": (
      <Menu title="Início">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MainPage />
        </motion.div>
      </Menu>
    ),
    "/inicio": (
      <Menu title="Início">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MainPage />
        </motion.div>
      </Menu>
    ),
    "/transacoes": (
      <Menu title="Transações">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Transactions {...params} />
        </motion.div>
      </Menu>
    ),
    "/dados-bancarios": (
      <Menu title="Dados Bancários">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <BankInfo />
        </motion.div>
      </Menu>
    ),
    [matchCart ? location : null]: (
      <Suspense fallback={<SpinnerWithDiv />}>
        <UserCart {...paramsCart} />
      </Suspense>
    ),
    // [matchUploadForCart ? location : null]: (
    //   <Suspense fallback={<SpinnerWithDiv />}>
    //     <HeaderBack title="Produtos" navigateTo={currentBackRoute || "/pedidos"}>
    //       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    //         <Products
    //           withIcon
    //           imgExtension={[".jpg", ".gif", ".png", ".gif"]}
    //           maxFileSize={5242880}
    //           {...paramsUploadForCart}
    //         />
    //       </motion.div>
    //     </HeaderBack>
    //   </Suspense>
    // ),
    "/upgrade": (
      <Menu title="Fazer Upgrade">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Upgrade />
        </motion.div>
      </Menu>
    ),
    "/minha-conta": (
      <Menu title="Minha Conta">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MyAccount role={role} />
        </motion.div>
      </Menu>
    ),
    [matchProductsRoot || matchProductsNew || matchProductsEdit ? location : null]: (
      <Menu
        // eslint-disable-next-line no-nested-ternary
        title={matchProductsEdit ? "Editar produto" : matchProductsNew ? "Novo produto" : "Produtos"}
        back={matchProductsEdit || matchProductsNew ? "/produtos" : null}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Productsv2 />
        </motion.div>
      </Menu>
    ),
    "/login": (
      <Menu title="Minha Conta">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MyAccount />
        </motion.div>
      </Menu>
    ),
    "/trocar-email": (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <UpdateEmail />
      </motion.div>
    ),
    "/trocar-senha": (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <UpdatePass />
      </motion.div>
    ),
    "/deletar-conta": (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DeleteAccount />
      </motion.div>
    ),
    "/criar-cobranca": (
      <Menu title="Criar Cobrança">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CreatePayment />
        </motion.div>
      </Menu>
    ),
    "/consulta": <BackgroundCheck />,
    "/tarifas": (
      <Menu title="Tarifas">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Rates />
        </motion.div>
      </Menu>
    ),
    "/creditos": (
      <Menu title="Créditos para consultas">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AboutCredits />
        </motion.div>
      </Menu>
    ),
    [match2 ? location : null]: <GerarBoleto {...params2} />,
    [matchMyReceipt ? location : null]: <Receipt {...paramsMyReceipt} receipt={receipt} setReceipt={setReceipt} />,
    [match ? location : null]: <Transactions {...params} setTransactionId={setTransactionId} />,
  }

  if (role === "") {
    privateRoutes["/preferencias"] = (
      <HeaderBack title="Preferências" navigateTo="/minha-conta">
        <Preferences />
      </HeaderBack>
    )
    privateRoutes["/colaboradores"] = (
      <Menu title="Vendedores">
        <Collaborators />
      </Menu>
    )
    privateRoutes["/convidar-colaborador"] = (
      <HeaderBack title="Convidar Vendedor" navigateTo="/colaboradores">
        <InviteCollaborator />
      </HeaderBack>
    )
    privateRoutes["/cadastrar-colaborador"] = (
      <Menu title="Minha Conta">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MyAccount />
        </motion.div>
      </Menu>
    )
    privateRoutes["/comprar-consulta"] = (
      <Menu title="Adquirir créditos">
        <CheckoutBackgroundCheck />
      </Menu>
    )
    privateRoutes[matchReceivable ? location : null] = <Receivables {...paramsReceivable} />
    privateRoutes["/update"] = (
      <HeaderBack title="Meus dados" navigateTo="/login">
        <UpdateUserInfo />
      </HeaderBack>
    )
    privateRoutes[matchBuyCreditBackgroundCheck ? location : null] = (
      <HeaderBack title="Finalizar compra" navigateTo="/comprar-consulta">
        <CheckoutBackgroundCheck {...paramsBuyCreditBackgroundCheck} />
      </HeaderBack>
    )
  }

  return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback="/" />)
}

Router.propTypes = {
  isLogged: PropTypes.bool.isRequired,
}

export default Router
