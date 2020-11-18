import React from 'react';
import SupportPage from '@bit/vitorbarbosa19.ziro.support-page';

const LoginSupportPage = () => {
  return (
    <SupportPage
      previous='/problemas-acesso'
      title='Está com problemas?'
      body='Já verificou sua caixa de spam? Se já olhou e o email não está lá,
      tudo bem. Só clicar no botão abaixo que vamos te ajudar!'
    />
  )
}

export default LoginSupportPage;
