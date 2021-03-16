import React, { useContext } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { advantagesContainer, advantagesDiv, innerAdvantagesDiv, advantagesLabel } from './styles';
import { userContext } from '../appContext';

const modals = () => {
  const { bgPrice } = useContext(userContext);

  const creditsModalTitle = (
    <div>
      <p style={{ color: '#323232' }}>Como funciona</p>
    </div>
  );
  
  const creditsModalBody = (
    <div>
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
          <label style={advantagesLabel}>{`Cada crédito custa ${bgPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`}</label>
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
    </div>
  );

  return {
    creditsModalTitle,
    creditsModalBody
  }

}

export default modals