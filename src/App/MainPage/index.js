import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter'
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { container } from '@ziro/theme';
import { activePlan, saldosContainer, card, saldosLabel, valorH1, iconsContainer, iconDiv, iconStyle, iconDescription } from './styles';
import { round } from '../Transactions/utils';
import { userContext } from '../appContext';
import currencyFormat from '@ziro/currency-format';
import fetch from './fetch';
import fetchBalance from './fetchBalance';
import getActivePlan from './utils/getActivePlan';

function MainPage() {
  const { role, zoopId, payoutAutomatic, fantasy, uid } = useContext(userContext)
  const [, setLocation] = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [customError, setCustomError] = useState(false);
  const [receivables, setReceivables] = useState([]);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initDate, setInitDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [days, setDays] = useState(0);
  const [balance, setBalance] = useState('');
  const [paidBalance, setPaidBalance] = useState('');
  const [activePlan, setActivePlan] = useState('');
  const setState = {
    setIsLoading, setErrorLoading, setReceivables, setData, setLocation,
    setHasMore, setLoadingMore, setInitDate, setFinalDate, setTotalAmount,
    setDays, setCustomError, setTotalTransactions, setBalance, setPaidBalance
  };
  
  const getPlan = async () => {
    let result = await getActivePlan(uid);
    return setActivePlan(result === 'standard' ? 'Fluxo' : result === 'financed30' ? 'Antecipado D+30' : result === 'financed14' ? 'Antecipado D+14' : 'Não encontrado.');
  };

  useEffect(() => {
    fetchBalance(zoopId, setState);
    getPlan();
    // fetch(zoopId, initDate, totalAmount, totalTransactions, data, days, receivables, fantasy, setState);
  },[])

  return (
    <div style={container}>

      <div style={saldosContainer}>
        <div style={card}>
          <label style={saldosLabel}>Plano ativo</label>
          <h1 style={valorH1}>
            {activePlan === '' ? 
              <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5rem" />
              </div>
            :
              activePlan
            }
          </h1>
        </div>
        
        {role === '' &&  
          <>
            <div style={card}>
              <label style={saldosLabel}>Saldo à receber hoje</label>
              <h1 style={valorH1}>
                {balance ? currencyFormat(round(balance, 2).toFixed(2).replace('.', '')) : 'R$ 0,00'}
              </h1>
            </div>

            <div style={card}>
              <label style={saldosLabel}>Saldo pago hoje</label>
              <h1 style={valorH1}>
                {paidBalance ? currencyFormat(round(paidBalance, 2).toFixed(2).replace('.', '')) : 'R$ 0,00'}
              </h1>
            </div>
          </>
        }
      </div>
      
      <div style={iconsContainer}>
        <div>
          <div style={iconDiv}>
              <Icon type='money' size={20} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/criar-cobranca')}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Cobrar</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='trending' size={20} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/transacoes')}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Vendas</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='id' size={20} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/recebiveis')}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Recebíveis</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='library' size={20} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/recebiveis/dados-bancarios')}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Dados<br />Bancários</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='user' size={20} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/colaboradores')}/>
          </div>
          
          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Vendedores</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
              <Icon type='gear' size={20} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/minha-conta')}/>
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
