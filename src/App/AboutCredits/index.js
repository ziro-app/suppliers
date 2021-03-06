import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'wouter'
import { container, fontTitle } from '@ziro/theme';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { advantagesDiv, advantagesLabel, innerAdvantagesDiv, advantagesContainer } from './styles';
import { userContext } from '../appContext';

const supportNumber = require('./supportNumber');

function AboutCredits() {
  const { 
    typeRegister,
    backgroundCheckRequests, 
    backgroundCheckRequestsPaid 
  } = useContext(userContext);

  const [, setLocation] = useLocation();

  return (
    <div style={container}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Illustration type="cardAnalysis" size={180} />
        <h1 style={{ fontFamily: 'Rubik', fontSize: '16px', textTransform: 'uppercase', color: '#323232', textAlign: 'center' }}>Deseja adquirir créditos?</h1>

        <label style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-5px' }}>
          {`Atualmente, você possui ${backgroundCheckRequests} crédito(s) gratuito(s) e ${backgroundCheckRequestsPaid === '' ? '0' : backgroundCheckRequestsPaid} crédito(s) pago(s). Veja abaixo as vantagens de adquirir mais créditos:`}
        </label>

        <div style={advantagesContainer}>
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='check' size={15} strokeWidth={2} style={{ background: 'white' }}/>
            </div>
            <label style={advantagesLabel}>Cada crédito custa <strong>R$10,00</strong></label>
          </div>
          
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='check' size={15} strokeWidth={2} style={{ background: 'white' }} />
            </div>
            <label style={advantagesLabel}>Seus créditos <strong>nunca</strong> expiram</label>
          </div>
          
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='check' size={15} strokeWidth={2} style={{ background: 'white' }} />
            </div>
            <label style={advantagesLabel}>Você recebe <strong>gratuitamente</strong> 10 créditos por mês</label>
          </div>
          
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='check' size={15} strokeWidth={2} style={{ background: 'white' }} />
            </div>
            <label style={advantagesLabel}>Você pode utilizar créditos para consultar CPF ou CNPJ</label>
          </div>
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='whats' size={15} strokeWidth={2} style={{ background: 'white' }} />
            </div>
            <label style={advantagesLabel}>Qualquer dúvida, fale com nosso time de vendas</label>
          </div>
        </div>

        <div style={{ display: 'grid', width: '100%', marginTop: '20px', opacity: '1', gap: '10px' }}>
          <Button
            type='button'
            cta='Adquirir créditos'
            template='regular'
            click={() => setLocation('/comprar-consulta')}
          />
          
          <Button
            type='button'
            cta='Falar com vendas'
            template='light'
            click={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
          />
        </div>
      </div>
    </div>
  )
}

export default AboutCredits;