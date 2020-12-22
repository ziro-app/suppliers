import React, { useContext } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { container } from '@ziro/theme';
import { activePlan, saldosContainer, card, saldosLabel, valorH1, iconsContainer, iconDiv, iconStyle, iconDescription } from './styles';
import { userContext } from '../appContext';

function MainPage() {
  const { role } = useContext(userContext)

  return (
    <div style={container}>

      <div style={saldosContainer}>
        <div style={card}>
          <label style={saldosLabel}>Plano ativo</label>
          <h1 style={valorH1}>Fluxo</h1>
        </div>
        
        {role === '' &&  
          <>
            <div style={card}>
              <label style={saldosLabel}>Saldo à receber hoje</label>
              <h1 style={valorH1}>R$ 23.564,00</h1>
            </div>

            <div style={card}>
              <label style={saldosLabel}>Saldo pago hoje</label>
              <h1 style={valorH1}>R$ 0,00</h1>
            </div>
          </>
        }
      </div>
      
      <div style={iconsContainer}>
        <div>
          <div style={iconDiv}>
              <Icon type='money' size={20} strokeWidth={2} style={iconStyle}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Cobrar</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='trending' size={20} strokeWidth={2} style={iconStyle}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Vendas</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='id' size={20} strokeWidth={2} style={iconStyle}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Recebíveis</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='library' size={20} strokeWidth={2} style={iconStyle}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Dados<br />Bancários</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='user' size={20} strokeWidth={2} style={iconStyle}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Vendedores</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='gear' size={20} strokeWidth={2} style={iconStyle}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Dados<br />Gerais</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
