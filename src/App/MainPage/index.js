import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { container } from '@ziro/theme';
import { activePlan, saldosContainer, consultasContainer, card, saldosLabel, valorH1, iconsContainer, iconDiv, iconStyle, iconDescription, cardTop } from './styles';
import { round } from '../Transactions/utils';
import { userContext } from '../appContext';
import currencyFormat from '@ziro/currency-format';
import fetchBalance from './fetchBalance';
import getActivePlan from './utils/getActivePlan';
import getBackgroundRequestsPaid from './utils/getBackgroundRequestsPaid';
import getBackgroundRequestsFree from './utils/getBackgroundRequestsFree';
import Skeleton from 'react-loading-skeleton';

function MainPage() {
    const supportNumber = require('./supportNumber');

    const { role, zoopId, payoutAutomatic, fantasy, uid,
        backgroundCheckRequests, backgroundCheckRequestsPaid, ownerId } = useContext(userContext);
    const [, setLocation] = useLocation();

    const [isErrorPlan, setIsErrorPlan] = useState(false);
    const [isErrorBalance, setIsErrorBalance] = useState(false);
    const [isErrorBgCheck, setIsErrorBgCheck] = useState(false);
    const [balance, setBalance] = useState(-1);
    const [paidBalance, setPaidBalance] = useState(-1);
    const [activePlan, setActivePlan] = useState('');
    const [backgroundPaidCollaborator, setBackgroundPaidCollaborator] = useState();
    const [backgroundFreeCollaborator, setBackgroundFreeCollaborator] = useState();
    const setState = {
        setIsErrorPlan,
        setIsErrorBalance,
        setIsErrorBgCheck,
        setLocation,
        setBalance,
        setPaidBalance,
    };

    const getPlan = async () => {
        try {
            let result = role === '' ? await getActivePlan(uid) : await getActivePlan(ownerId);
            return setActivePlan(
                result === 'standard' ? 'Fluxo' :
                    result === 'financed30' && window.innerWidth < 400 ? 'Antecip. D+30' :
                        result === 'financed30' && window.innerWidth > 400 ? 'Antecipado D+30' :
                            result === 'financed14' && window.innerWidth < 400 ? 'Antecip. D+14' :
                                result === 'financed14' && window.innerWidth > 400 ? 'Antecipado D+14' :
                                    setIsErrorPlan(true));
        } catch (error) {
            console.log('Erro getPlan:', error)
        }
    };

    // Somente usar função se for conta de vendedor
    const getBackgroundPaidCollab = async () => {
        const resultPaidCollab = await getBackgroundRequestsPaid(ownerId);
        return setBackgroundPaidCollaborator(resultPaidCollab);
    };

    // Somente usar função se for conta de vendedor
    const getBackgroundFreeCollab = async () => {
        const resultFreeCollab = await getBackgroundRequestsFree(ownerId);
        return setBackgroundFreeCollaborator(resultFreeCollab);
    };

    useEffect(() => {
        // Busca os saldos da Zoop
        try {
            fetchBalance(zoopId, payoutAutomatic, setState);

            // Busca o plano ativo do usuário
            try {
                getPlan();
                // console.log('payoutAutomatic:', payoutAutomatic);

                // Busca as consultas caso conta for de vendedor
                { role !== '' && getBackgroundPaidCollab() }
                { role !== '' && getBackgroundFreeCollab() }

            } catch (error) {
                console.log('Erro getPlan:', error)
                throw { msg: 'Erro ao buscar plano ativo.', customError: true };
            }

        } catch (error) {
            console.log('Erro fetchBalance:', error);
            throw { msg: 'Erro ao buscar saldo.', customError: true };
        }
    }, []);

    const runErrorBalance = () => {
        return (
            <Error
                title="Erro ao buscar saldo"
                message="Entre em contato com o suporte para corrigir seu saldo."
                type="noData"
                btnMsg="Falar com suporte"
                style={{ display: 'grid', placeItems: 'center', textAlign: 'center', height: '300px', gap: '7px' }}
                backRouteFunction={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
            />
        )
    };

    const runErrorPlan = () => {
        return (
            <Error
                title="Plano não encontrado"
                message="Entre em contato com o suporte para cadastrar seu plano."
                type="noData"
                btnMsg="Falar com suporte"
                style={{ display: 'grid', placeItems: 'center', textAlign: 'center', height: '300px', gap: '7px' }}
                backRouteFunction={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
            />
        )
    };

    const runErrorBgCheck = () => {
        return (
            <Error
                title="Erro ao buscar consultas"
                message="Entre em contato com o suporte para verificar suas consultas."
                type="noData"
                btnMsg="Falar com suporte"
                style={{ display: 'grid', placeItems: 'center', textAlign: 'center', height: '300px', gap: '7px' }}
                backRouteFunction={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
            />
        )
    };

    return (
        <div style={container}>
            <div style={saldosContainer}>
                <h1 style={{ width: '5rem', marginBottom: '-25px' }}>Geral</h1>
                {!isErrorPlan ?
                    <div style={{ display: 'flex', width: '100%', padding: '20px 0px', borderRadius: '10px', marginBottom: '-22px', boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px', justifyContent: 'space-evenly' }}>
                        <div style={{ textAlign: 'center' }}>
                            <label style={saldosLabel}>Plano ativo</label>
                            <h1 style={valorH1}>
                                {!isErrorPlan ?
                                    activePlan ? activePlan : 'Não encontrado'
                                    : runErrorPlan()
                                }
                            </h1>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <label style={saldosLabel}>Recebimento na conta</label>
                            <h1 style={valorH1}>
                                {payoutAutomatic === '' ? <Skeleton width={50} />
                                    : payoutAutomatic === true ? 'Automático'
                                        : payoutAutomatic === false ? 'Manual'
                                            : payoutAutomatic !== true && payoutAutomatic !== false ? 'Não encontrado' : null
                                }
                            </h1>
                        </div>
                    </div>
                    : runErrorPlan()
                }
            </div>

            {role === '' && (
                <div style={{ display: 'flex', width: '100%', gap: '10px', flexDirection: 'column' }}>
                    <h1 style={{ marginTop: '50px', width: '5.3rem', marginBottom: '0px' }}>Saldos</h1>
                    {!isErrorBalance ?
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={card}>
                                <label style={saldosLabel}>À receber hoje (R$)</label>
                                <h1 style={valorH1}>
                                    {/* {console.log('balance:', balance)} */}

                                    {balance < 0 ? <Skeleton width={50} /> : balance ? currencyFormat(round(balance, 2).toFixed(2).replace('.', '')).replace('R$', '') : '0,00'}
                                </h1>
                            </div>

                            <div style={card}>
                                <label style={saldosLabel}>Pago hoje (R$)</label>
                                <h1 style={valorH1}>
                                    {/* {console.log('paidBalance:', paidBalance)} */}

                                    {paidBalance < 0 ?
                                        <Skeleton width={50} />
                                        : paidBalance ? currencyFormat(round(paidBalance, 2).toFixed(2).replace('.', '')).replace('R$', '')
                                            : '0,00'
                                    }
                                </h1>
                            </div>
                        </div>
                        : runErrorBalance()
                    }
                </div>
            )}

            <div style={consultasContainer}>
                <h1 style={{ width: '5rem', marginBottom: '-25px' }}>Consultas</h1>
                {!isErrorBgCheck ?
                    <div style={{ display: 'flex', width: '100%', padding: '20px 0px', borderRadius: '10px', marginBottom: '-22px', boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px', justifyContent: 'space-evenly' }}>
                        <div style={{ textAlign: 'center' }}>
                            <label style={saldosLabel}>Consultas pagas</label>
                            <h1 style={valorH1}>{
                                role === '' && backgroundCheckRequestsPaid !== '' ? backgroundCheckRequestsPaid
                                    : role === '' && backgroundCheckRequestsPaid === '' ? '0'
                                        : backgroundPaidCollaborator}
                            </h1>
                        </div>

                        <div>
                            <label style={saldosLabel}>Consultas gratuitas</label>
                            <h1 style={valorH1}>{
                                role === '' && backgroundCheckRequests !== '' ? backgroundCheckRequests
                                    : role === '' && backgroundCheckRequests === '' ? '0'
                                        : backgroundFreeCollaborator}
                            </h1>
                        </div>
                    </div>
                    : runErrorBgCheck()
                }
            </div>

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
                        <label style={{ fontSize: '1.3rem' }}>Criar Cobrança</label>
                    </div>
                </div>
                {role === '' &&
                    <div>
                        <div style={iconDiv}>
                            <Icon type="money" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/recebiveis')} />
                        </div>

                        <div style={iconDescription}>
                            <label style={{ fontSize: '1.3rem' }}>Recebíveis</label>
                        </div>
                    </div>
                }
                <div>
                    <div style={iconDiv}>
                        <Icon type="search" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/consulta')} />
                    </div>

                    <div style={iconDescription}>
                        <label style={{ fontSize: '1.3rem' }}>Consultar<br /> CPF/CNPJ</label>
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
                {role === '' &&
                    <div>
                        <div style={iconDiv}>
                            <Icon type="user" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/colaboradores')} />
                        </div>

                        <div style={iconDescription}>
                            <label style={{ fontSize: '1.3rem' }}>Vendedores</label>
                        </div>
                    </div>
                }
                {role === '' &&
                    <div>
                        <div style={iconDiv}>
                            <Icon type="library" color={'#fff'} size={21} strokeWidth={2} style={iconStyle} onClick={() => setLocation('/dados-bancarios')} />
                        </div>

                        <div style={iconDescription}>
                            <label style={{ fontSize: '1.3rem' }}>
                                Dados
                <br />
                Bancários
              </label>
                        </div>
                    </div>
                }
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
