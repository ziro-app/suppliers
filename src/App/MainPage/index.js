import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { db } from '../../Firebase/index';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { container, primaryColor, shadow, fontTitle } from '@ziro/theme';
import { saldosContainer, consultasContainer, card, saldosLabel, valorH1, iconsContainer, iconDiv, iconStyle, iconDescription, cardSimplificado } from './styles';
import { round } from '../Transactions/utils';
import { userContext } from '../appContext';
import currencyFormat from '@ziro/currency-format';
import fetchBalance from './fetchBalance';
import getActivePlan from './utils/getActivePlan';
import getBackgroundRequestsPaid from './utils/getBackgroundRequestsPaid';
import getBackgroundRequestsFree from './utils/getBackgroundRequestsFree';
import Skeleton from 'react-loading-skeleton';
import { ImageIcon } from './ImageIcon';
import { CartIcon } from './CartIcon';


function MainPage() {
    const supportNumber = require('./supportNumber');

    const { role, zoopId, payoutAutomatic, fantasy, uid,
        backgroundCheckRequests, backgroundCheckRequestsPaid, ownerId, typeRegister } = useContext(userContext);
    const [, setLocation] = useLocation();

    const [isErrorPlan, setIsErrorPlan] = useState(false);
    const [isErrorBalance, setIsErrorBalance] = useState(false);
    const [isErrorBgCheck, setIsErrorBgCheck] = useState(false);
    const [balance, setBalance] = useState(-1);
    const [paidBalance, setPaidBalance] = useState(-1);
    const [activePlan, setActivePlan] = useState('');
    const [freeBgCheck, setFreeBgCheck] = useState(backgroundCheckRequests);
    const [paidBgCheck, setPaidBgCheck] = useState(backgroundCheckRequestsPaid);
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

    useEffect(() => {
        async function getFreeBgCheck() {
            await db
                .collection('suppliers')
                .where('fantasia', '==', fantasy.toUpperCase())
                .onSnapshot(snap => {
                if (!snap.empty) {
                    snap.forEach(doc => {
                        setFreeBgCheck(doc.data().backgroundCheckRequestsAvailable);
                    });
                }
                });
            }
        
        async function getPaidBgCheck() {
            await db
                .collection('suppliers')
                .where('fantasia', '==', fantasy.toUpperCase())
                .onSnapshot(snap => {
                if (!snap.empty) {
                    snap.forEach(doc => {
                        setPaidBgCheck(doc.data().backgroundCheckRequestsAvailablePaid);
                    });
                }
                });
            }
        getFreeBgCheck();
        getPaidBgCheck();
    }, [])

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

    const checkWidth = () => window.innerWidth < 400 ? '70%' : '35%';
    const checkWidth2 = () => window.innerWidth < 400 ? '80%' : '41%';
    const checkGap = () => window.innerWidth < 400 ? '4rem' : '9rem';

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
        typeRegister === 'Completo' &&
        (
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
                                    typeRegister === 'Simplificado' ? 'Nenhum' :
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
                    {!isErrorBalance && typeRegister === 'Completo' ?
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
                    {typeRegister === 'Simplificado' &&
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={cardSimplificado}>
                                <label>Você não possui saldos pois não está habilitado a transacionar. Habilite agora!</label>
                                <div onClick={() => setLocation('/upgrade')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', marginTop: '20px', border: '1px solid rgba(34, 34, 34, 0.2)', width: checkWidth(), borderRadius: '25px', cursor: 'pointer', backgroundColor: primaryColor, boxShadow: shadow }}>
                                    <Icon type="rocket" size={21} color="#fafafa" style={{ marginRight: '10px' }} />
                                    <label style={{ cursor: 'pointer', color: '#fafafa', fontSize: '1.3rem', fontFamily: fontTitle }}>Fazer upgrade</label>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            )}

            <div style={consultasContainer}>
                <h1 style={{ width: '5rem', marginBottom: '-25px' }}>Consultas</h1>
                {!isErrorBgCheck ?
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '10px', marginBottom: '-22px', boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px', justifyContent: 'space-evenly' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: checkGap(), padding: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <label style={saldosLabel}>Consultas pagas</label>
                                <h1 style={valorH1}>{
                                    role === '' && paidBgCheck !== '' ? paidBgCheck
                                        : role === '' && paidBgCheck === '' ? '0'
                                            : backgroundPaidCollaborator}
                                </h1>
                            </div>

                            <div>
                                <label style={saldosLabel}>Consultas gratuitas</label>
                                <h1 style={valorH1}>{
                                    role === '' && freeBgCheck !== '' ? freeBgCheck
                                        : role === '' && freeBgCheck === '' ? '0'
                                            : backgroundFreeCollaborator}
                                </h1>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', borderTop: '1px solid rgba(0, 0, 0, 0.07)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <label style={{ textAlign: 'center' }}>Adquira créditos para consultar CPF e CNPJ. Venda para clientes novos com mais segurança.</label>
                                <div onClick={() => setLocation('/creditos')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', border: '1px solid rgba(34, 34, 34, 0.2)', width: checkWidth2(), marginTop: '2rem', borderRadius: '25px', cursor: 'pointer', backgroundColor: primaryColor, boxShadow: shadow }}>
                                    <Icon type="plusCircle" size={21} color="#fafafa" style={{ marginRight: '10px' }} />
                                    <label style={{ cursor: 'pointer', color: '#fafafa', fontSize: '1.3rem', fontFamily: fontTitle }}>Adquirir créditos</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    : runErrorBgCheck()
                }
            </div>

            <h1 style={{ marginTop: '60px', width: '7rem', marginBottom: '-30px' }}>Atalhos</h1>

            <div style={iconsContainer}>
                <div>
                    <div style={iconDiv}>
                        <ImageIcon colorFill="black" onClick={() => setLocation('/produtos')} />
                    </div>

                    <div style={iconDescription}>
                        <label style={{ fontSize: '1.3rem' }}>Produtos</label>
                    </div>
                </div>
                <div>
                    <div style={iconDiv}>
                        <CartIcon strokeColor="white" strokeWidth={2} onClick={() => setLocation('/pedidos')} />
                    </div>

                    <div style={iconDescription}>
                        <label style={{ fontSize: '1.3rem' }}>Pedidos</label>
                    </div>
                </div>
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
                        <label style={{ fontSize: '1.3rem' }}>Criar <br/>Cobrança</label>
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
