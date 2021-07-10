import React, { useState } from "react"
import Container from "@bit/ziro.views.container"
import FixedBar from "@bit/ziro.views.fixed-bar"
import Header from "@bit/ziro.views.header"
import Form from "@bit/ziro.views.form"
import Title from "@bit/ziro.views.title"
import { InputEmail } from "@bit/ziro.views.input"
import Button from "@bit/ziro.views.button"
import { TextError, TextSuccess } from "./utils/Modals"
import validations from "./utils/validations"
import onSubmit from "./utils/onSubmit"
import FixedBarContent from "../FixedBarContent"
import { btn } from "./styles"

export const ResendEmail = () => {
  const [email, setEmail] = useState("")
  return (
    <Container withoutHeight>
      {containerSizes => (
        <>
          <FixedBar containerSizes={containerSizes} position="top">
            <FixedBarContent>
              <Header useHistory title="Reenviar email de confirmação" />
            </FixedBarContent>
          </FixedBar>
          <Form
            validations={validations(email)}
            onSubmit={() => onSubmit(email)}
            TextSuccess={<TextSuccess />}
            TextError={<TextError />}
          >
            <Title size="smallMedium">Email</Title>
            <InputEmail
              inputName="email"
              placeholder="email@email.com"
              value={email.toLowerCase()}
              setValue={setEmail}
            />
            <Button type="submit" style={btn}>
              Enviar
            </Button>
          </Form>
        </>
      )}
    </Container>
  )
}
