/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useContext } from "react"
import PropTypes from "prop-types"
import Header from "@bit/vitorbarbosa19.ziro.header"
import Drawer from "@bit/vitorbarbosa19.ziro.drawer"
import DrawerPanel from "@bit/vitorbarbosa19.ziro.drawer-panel"
import Icon from "@bit/vitorbarbosa19.ziro.icon"
import { containerWithPadding } from "@ziro/theme"
import { HeaderBack } from "../HeaderBack"
import { auth } from "../../Firebase/index"
import { userContext } from "../appContext"
import { ImageIcon } from "./ImageIcon"

export const Menu = ({ title, children, back }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { fname, cnpj, role, typeRegister } = useContext(userContext)

  const mountDrawerpanel = () => {
    if (role) {
      return (
        <DrawerPanel
          username={fname || "Usuário"}
          userdata={cnpj ? `CNPJ: ${cnpj}` : ""}
          options={[
            {
              path: "/inicio",
              onClick: () => setIsOpen(false),
              icon: <Icon type="home" size={15} strokeWidth={2} />,
              text: "Início",
            },
            {
              path: "/produtos",
              onClick: () => setIsOpen(false),
              icon: <ImageIcon />,
              text: "Produtos",
            },
            {
              path: "/pedidos",
              onClick: () => setIsOpen(false),
              icon: <Icon type="cart" size={15} strokeWidth={2} />,
              text: "Pedidos",
            },
            {
              path: "/transacoes",
              onClick: () => setIsOpen(false),
              icon: <Icon type="trending" size={15} strokeWidth={2} />,
              text: "Vendas",
            },
            {
              path: "/criar-cobranca",
              onClick: () => setIsOpen(false),
              icon: <Icon type="link" size={15} strokeWidth={2} />,
              text: "Criar Cobrança",
            },
            // {
            //     path: '/recebiveis',
            //     onClick: () => setIsOpen(false),
            //     icon: <Icon type='money' size={15} strokeWidth={2} />,
            //     text: 'Recebíveis'
            // },
            {
              path: "/tarifas",
              onClick: () => setIsOpen(false),
              icon: <Icon type="percent" size={15} strokeWidth={2} />,
              text: "Tarifas",
            },
            {
              path: "/consulta",
              onClick: () => setIsOpen(false),
              icon: <Icon type="search" size={15} strokeWidth={2} />,
              text: "Consultar CPF/CNPJ",
            },
            {
              path: "/minha-conta",
              onClick: () => setIsOpen(false),
              icon: <Icon type="gear" size={15} strokeWidth={2} />,
              text: "Minha Conta",
            },
            {
              path: "/login",
              onClick: () => auth.signOut(),
              icon: <Icon type="logout" size={15} strokeWidth={3} />,
              text: "Sair",
            },
          ]}
        />
      )
    }
    return (
      <>
        {typeRegister && typeRegister === "Simplificado" ? (
          <DrawerPanel
            username={fname || "Usuário"}
            userdata={cnpj ? `CNPJ: ${cnpj}` : ""}
            options={[
              {
                path: "/upgrade",
                onClick: () => setIsOpen(false),
                icon: <Icon type="rocket" size={15} strokeWidth={2} />,
                text: "Fazer Upgrade",
              },
              {
                path: "/inicio",
                onClick: () => setIsOpen(false),
                icon: <Icon type="home" size={15} strokeWidth={2} />,
                text: "Início",
              },
              {
                path: "/produtos",
                onClick: () => setIsOpen(false),
                icon: <ImageIcon />,
                text: "Produtos",
              },
              {
                path: "/pedidos",
                onClick: () => setIsOpen(false),
                icon: <Icon type="cart" size={15} strokeWidth={2} />,
                text: "Pedidos",
              },
              {
                path: "/transacoes",
                onClick: () => setIsOpen(false),
                icon: <Icon type="trending" size={15} strokeWidth={2} />,
                text: "Vendas",
              },
              {
                path: "/criar-cobranca",
                onClick: () => setIsOpen(false),
                icon: <Icon type="link" size={15} strokeWidth={2} />,
                text: "Criar Cobrança",
              },
              {
                path: "/recebiveis",
                onClick: () => setIsOpen(false),
                icon: <Icon type="money" size={15} strokeWidth={2} />,
                text: "Recebíveis",
              },
              // {
              //     path: '/tarifas',
              //     onClick: () => setIsOpen(false),
              //     icon: <Icon type='percent' size={15} strokeWidth={2} />,
              //     text: 'Tarifas'
              // },
              {
                path: "/consulta",
                onClick: () => setIsOpen(false),
                icon: <Icon type="search" size={15} strokeWidth={2} />,
                text: "Consultar CPF/CNPJ",
              },
              {
                path: "/colaboradores",
                onClick: () => setIsOpen(false),
                icon: <Icon type="user" size={15} strokeWidth={2} />,
                text: "Vendedores",
              },
              {
                path: "/minha-conta",
                onClick: () => setIsOpen(false),
                icon: <Icon type="gear" size={15} strokeWidth={2} />,
                text: "Minha Conta",
              },
              {
                path: "/login",
                onClick: () => auth.signOut(),
                icon: <Icon type="logout" size={15} strokeWidth={3} />,
                text: "Sair",
              },
            ]}
          />
        ) : (
          <DrawerPanel
            username={fname || "Usuário"}
            userdata={cnpj ? `CNPJ: ${cnpj}` : ""}
            options={[
              {
                path: "/inicio",
                onClick: () => setIsOpen(false),
                icon: <Icon type="home" size={15} strokeWidth={2} />,
                text: "Início",
              },
              {
                path: "/produtos",
                onClick: () => setIsOpen(false),
                icon: <ImageIcon />,
                text: "Produtos",
              },
              {
                path: "/pedidos",
                onClick: () => setIsOpen(false),
                icon: <Icon type="cart" size={15} strokeWidth={2} />,
                text: "Pedidos",
              },
              {
                path: "/transacoes",
                onClick: () => setIsOpen(false),
                icon: <Icon type="trending" size={15} strokeWidth={2} />,
                text: "Vendas",
              },
              {
                path: "/criar-cobranca",
                onClick: () => setIsOpen(false),
                icon: <Icon type="link" size={15} strokeWidth={2} />,
                text: "Criar Cobrança",
              },
              {
                path: "/recebiveis",
                onClick: () => setIsOpen(false),
                icon: <Icon type="money" size={15} strokeWidth={2} />,
                text: "Recebíveis",
              },
              {
                path: "/consulta",
                onClick: () => setIsOpen(false),
                icon: <Icon type="search" size={15} strokeWidth={2} />,
                text: "Consultar CPF/CNPJ",
              },
              {
                path: "/colaboradores",
                onClick: () => setIsOpen(false),
                icon: <Icon type="user" size={15} strokeWidth={2} />,
                text: "Vendedores",
              },
              {
                path: "/tarifas",
                onClick: () => setIsOpen(false),
                icon: <Icon type="percent" size={15} strokeWidth={2} />,
                text: "Tarifas",
              },
              {
                path: "/minha-conta",
                onClick: () => setIsOpen(false),
                icon: <Icon type="gear" size={15} strokeWidth={2} />,
                text: "Minha Conta",
              },
              {
                path: "/login",
                onClick: () => auth.signOut(),
                icon: <Icon type="logout" size={15} strokeWidth={3} />,
                text: "Sair",
              },
            ]}
          />
        )}
      </>
    )
  }
  if (back) {
    return (
      <div style={{ ...containerWithPadding, padding: "20px 12px 60px" }}>
        <HeaderBack title={title} navigateTo={back} withoutContainer>
          <Drawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
            {mountDrawerpanel()}
          </Drawer>
          {children}
        </HeaderBack>
      </div>
    )
  }
  return (
    <div style={{ ...containerWithPadding, padding: "20px 12px 60px" }}>
      <Header type="icon" title={title} icon="menu" setIsOpen={() => setIsOpen(true)} />
      <Drawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
        {mountDrawerpanel()}
      </Drawer>
      {children}
    </div>
  )
}

Menu.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.element)]).isRequired,
}
