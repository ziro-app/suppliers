import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { advantagesContainer, advantagesDiv, innerAdvantagesDiv, advantagesLabel } from './styles';

export const creditsModalTitle = (
  <div>
    <p style={{ color: '#323232' }}>Deseja adquirir créditos?</p>
  </div>
);

export const creditsModalBody = (
  <div>
    <div style={advantagesContainer}>
      <div style={advantagesDiv}>
        <div style={innerAdvantagesDiv}>
          <Icon type="check" size={15} strokeWidth={2} style={{ background: 'white' }} />
        </div>
        <label style={advantagesLabel}>1 crédito te dá direito a 1 consulta de CPF ou CNPJ</label>
      </div>

      <div style={advantagesDiv}>
        <div style={innerAdvantagesDiv}>
          <Icon type="money" size={15} strokeWidth={2} style={{ background: 'white' }} />
        </div>
        <label style={advantagesLabel}>Cada crédito custa R$10,00</label>
      </div>

      <div style={advantagesDiv}>
        <div style={innerAdvantagesDiv}>
          <Icon type="clock" size={15} strokeWidth={2} style={{ background: 'white' }} />
        </div>
        <label style={advantagesLabel}>Os créditos comprados nunca expiram</label>
      </div>

      <div style={advantagesDiv}>
        <div style={innerAdvantagesDiv}>
          <Icon type="hardDrive" size={15} strokeWidth={2} style={{ background: 'white' }} />
        </div>
        <label style={advantagesLabel}>Consultar o mesmo CPF ou CNPJ mais do que uma vez não consome um novo crédito</label>
      </div>

      <div style={advantagesDiv}>
        <div style={innerAdvantagesDiv}>
          <Icon type="award" size={15} strokeWidth={2} style={{ background: 'white' }} />
        </div>
        <label style={advantagesLabel}>Todo dia 01 do mês você recebe 10 novos créditos gratuitos para usar e que expiram no fim do mês</label>
      </div>
    </div>
  </div>
);