import React from "react"
import { useLocation } from "@bit/ziro.views.router"
import Container from "@bit/ziro.views.container"
import FixedBar from "@bit/ziro.views.fixed-bar"
import Header from "@bit/ziro.views.header"
import Text from "@bit/ziro.views.text"
import Link from "@bit/ziro.views.link"
import Button from "@bit/ziro.views.button"
import FixedBarContent from "../FixedBarContent"
import { container } from "./styles"

export const LoginTrouble = () => {
  const [location] = useLocation()
  return (
    <Container withoutHeight>
      {containerSizes => (
        <>
          <FixedBar containerSizes={containerSizes} position="top">
            <FixedBarContent>
              <Header useHistory title="Corrigir acesso" />
            </FixedBarContent>
          </FixedBar>
          <div style={container}>
            <Text>Escolha a opção desejada</Text>

            <Link href={`${location}/reenviar-email`}>
              <Button type="button" buttonStyle="regular">
                Reenviar email de confirmação
              </Button>
            </Link>

            <Link href={`${location}/resetar-senha`}>
              <Button type="button" buttonStyle="regular">
                Resetar senha
              </Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  )
}
