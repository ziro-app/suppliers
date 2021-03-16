import React, { useState, useEffect, useContext } from 'react'
import { db } from '../../Firebase/index';

import { useLocation } from 'wouter'
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { advantagesDiv, advantagesLabel, innerAdvantagesDiv, advantagesContainer } from './styles';
import { userContext } from '../appContext';

const supportNumber = require('./supportNumber');

function AboutCredits() {
  const { 
    backgroundCheckRequests, 
    backgroundCheckRequestsPaid 
  } = useContext(userContext);

  const [, setLocation] = useLocation();
  const [creditsValue, setCreditsValue] = useState();
  const [bgCheckPrice, setBgCheckPrice] = useState(0);
  
  useEffect(() => {
    backgroundCheckRequests + backgroundCheckRequestsPaid === '' ? setCreditsValue('0') :
    backgroundCheckRequests + backgroundCheckRequestsPaid === '0' ? setCreditsValue('0') :
    backgroundCheckRequests + backgroundCheckRequestsPaid === undefined ? setCreditsValue('0') :
    backgroundCheckRequests + backgroundCheckRequestsPaid === null ? setCreditsValue('0') :
    setCreditsValue(backgroundCheckRequests + backgroundCheckRequestsPaid)
  }, [])

  useEffect(() => {
    async function getBgCheckPrice() {
      await db
          .collection('utilities')
          .doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
          .onSnapshot(snap => {
              if (!snap.empty) {
                setBgCheckPrice(snap.data().main.standardValueBackgroundCheck);
              }
          });

  }

  getBgCheckPrice();
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Illustration type="cardAnalysis" size={180} />
        <h1 style={{ fontFamily: 'Rubik', fontSize: '16px', textTransform: 'uppercase', color: '#323232', textAlign: 'center' }}>Deseja adquirir créditos?</h1>

        <label style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-5px' }}>
          {`Você possui ${creditsValue} crédito(s) para usar. Adquira mais a qualquer momento ou fale com nosso time de vendas`}
        </label>

        <div style={advantagesContainer}>
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='check' size={15} strokeWidth={2} style={{ background: 'white' }}/>
            </div>
            <label style={advantagesLabel}>1 crédito te dá direito a 1 consulta de CPF ou CNPJ</label>
          </div>
          
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='money' size={15} strokeWidth={2} style={{ background: 'white' }}/>
            </div>
            <label style={advantagesLabel}>{`Cada crédito custa ${bgCheckPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`}</label>
          </div>
          
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='clock' size={15} strokeWidth={2} style={{ background: 'white' }}/>
            </div>
            <label style={advantagesLabel}>Os créditos comprados nunca expiram</label>
          </div>
          
          <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='hardDrive' size={15} strokeWidth={2} style={{ background: 'white' }}/>
            </div>
            <label style={advantagesLabel}>Consultar o mesmo CPF/CNPJ mais que uma vez não consome novo crédito</label>
          </div>
          
          {/* <div style={advantagesDiv}>
            <div style={innerAdvantagesDiv}>
              <Icon type='award' size={15} strokeWidth={2} style={{ background: 'white' }}/>
            </div>
            <label style={advantagesLabel}>No dia 01 de cada mês você recebe 10 créditos gratuitos que expiram no fim do mês</label>
          </div> */}

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