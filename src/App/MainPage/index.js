import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { container } from '@ziro/theme';
import { activePlan, saldosContainer, card, saldosLabel, valorH1, iconsContainer, iconDiv, iconStyle, iconDescription, cardTop } from './styles';
import { fontTitle } from '@ziro/theme'
import { round } from '../Transactions/utils';
import { userContext } from '../appContext';
import currencyFormat from '@ziro/currency-format';
import fetch from './fetch';
import fetchBalance from './fetchBalance';
import getActivePlan from './utils/getActivePlan';
import Skeleton from 'react-loading-skeleton';

function MainPage() {
  const { role, zoopId, payoutAutomatic, fantasy, uid, backgroundCheckRequests } = useContext(userContext);
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
  const [balance, setBalance] = useState(-1);
  const [paidBalance, setPaidBalance] = useState(-1);
  const [activePlan, setActivePlan] = useState('');
  const setState = {
    setIsLoading,
    setErrorLoading,
    setReceivables,
    setData,
    setLocation,
    setHasMore,
    setLoadingMore,
    setInitDate,
    setFinalDate,
    setTotalAmount,
    setDays,
    setCustomError,
    setTotalTransactions,
    setBalance,
    setPaidBalance,
  };

  const getPlan = async () => {
    let result = await getActivePlan(uid);
    return setActivePlan(result === 'standard' ? 'Fluxo' : result === 'financed30' ? 'Antecipado D+30' : result === 'financed14' ? 'Antecipado D+14' : 'Não encontrado');
  };

  useEffect(() => {
    fetchBalance(zoopId, setState);
    getPlan();
  }, []);

  return (
    <div style={container}>
      <div style={saldosContainer}>
        <h1 style={{ width: '5rem' , marginBottom: '-25px' }}>Geral</h1>
        <div style={{ display: 'flex', width: '100%', padding: '20px 0px', borderRadius: '10px', marginBottom: '-22px', boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px', justifyContent: 'space-evenly' }}>
          <div>
            <label style={saldosLabel}>Plano ativo</label>
            <h1 style={valorH1}>{activePlan === '' ? <Skeleton width={150} height={30} /> : activePlan}</h1>
          </div>

          <div>
            <label style={saldosLabel}>Consultas CPF/CNPJ</label>
            <h1 style={valorH1}>{backgroundCheckRequests === '' ? <Skeleton width={150} height={30} /> : backgroundCheckRequests}</h1>
          </div>
        </div>
      </div>

      {role === '' && (
        <div style={{ display: 'flex', width: '100%', gap: '10px', flexDirection: 'column' }}>
          <h1 style={{ marginTop: '50px', width: '5.3rem', marginBottom: '0px' }}>Saldos</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={card}>
              <label style={saldosLabel}>À receber hoje (R$)</label>
              <h1 style={valorH1}>
                {balance < 0 ? 
                  <Skeleton width={150} height={30} /> 
                  : balance ? currencyFormat(round(balance, 2).toFixed(2).replace('.', '')) 
                  : 'R$ 0,00'
                }
              </h1>
            </div>

            <div style={card}>
              <label style={saldosLabel}>Pago hoje (R$)</label>
              <h1 style={valorH1}>
                {paidBalance < 0 ? 
                  <Skeleton width={150} height={30} />
                  : paidBalance ? currencyFormat(round(paidBalance, 2).toFixed(2).replace('.', '')) 
                  : 'R$ 0,00'
                }
              </h1>
            </div>
          </div>
        </div>
      )}

      <h1 style={{ marginTop: '60px', width: '7rem', marginBottom: '-30px' }}>Atalhos</h1>
      
      <div style={iconsContainer}>
        <div>
          <div style={iconDiv}>
            <Icon type="trending" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/transacoes')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Vendas</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="link" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/criar-cobranca')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Cobrar</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="money" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/recebiveis')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Recebíveis</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="money" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/consulta')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Consultar<br /> CPF / CNPJ</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="percent" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/tarifas')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Tarifas</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="user" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/colaboradores')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>Vendedores</label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="library" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/recebiveis/dados-bancarios')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>
              Dados
              <br />
              Bancários
            </label>
          </div>
        </div>
        <div>
          <div style={iconDiv}>
            <Icon type="gear" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/minha-conta')} />
          </div>

          <div style={iconDescription}>
            <label style={{ fontSize: '1.3rem' }}>
              Minha
              <br />
              Conta
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
