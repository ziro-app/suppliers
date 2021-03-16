import React, { useContext } from 'react';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Table from '@bit/vitorbarbosa19.ziro.table';
import { fontBody } from '@ziro/theme';
import { useLocation } from 'wouter';
import { supportPhoneNumber } from "@bit/vitorbarbosa19.ziro.utils.support-phone-number";
import { userContext } from '../appContext';

import useLoadRates from './hooks/useLoadRates'

const Rates = () => {
    const [, setLocation] = useLocation();
    const { typeRegister, role } = useContext(userContext);
    
    const {
        blockDetails,
        dataRows,
        isLoading,
        isError
    } = useLoadRates()

    const dataTable = (data, title) => ([
        {
            title,
            header: [
                'Parcela',
                'Sem Seguro',
                'Com Seguro',
            ],
            rows: data,
            totals: [],
        },
    ])

    if(isLoading) <Spinner />

    if(isError) return (
        <Error
            title="Plano não encontrado"
            message="Você ainda não possui um plano de vendas cadastrado e não
                    pode gerar links de pagamento. Entre em contato com o suporte para cadastrar seu plano."
            type="noData"
            btnMsg="Falar com suporte"
            backRoute="/transacoes"
            backRouteFunction={(route) => {
                window.open(`https://api.whatsapp.com/send?phone=${supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")
                setLocation(route)
            }}
        />
    )

    return (
        <div style={{ display: 'grid', gap: '5px' }}>
            {typeRegister === 'Completo' && role === '' &&
                <Details
                    blocks={blockDetails}
                    blockGap="20px"
                />
            }
            
            {role !== '' &&
                <Details 
                    blocks={blockDetails}
                    blockGap="20px"
                />
            }

            {typeRegister === 'Simplificado' &&
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '25px' }}>
                    <Illustration type="upgradePlan" size={200} />
                    <label style={{ fontFamily: fontBody, textAlign: 'center' }}>Você não está habilitado a transacionar. Veja as tarifas com o nosso time de vendas.</label>
                    <Button
                        type='link'
                        cta='Habilitar agora'
                        template='regular'
                        navigate={() => { setLocation('/upgrade') }}
                    />
                </div>
            }

            {
                typeRegister === 'Completo' && role === '' && dataRows.map(data => (
                    <div
                        aria-label= 'table'
                        key={data.brand}
                        style={{marginTop:'20px'}}
                    >
                        <Table
                            data={
                                dataTable(
                                    data.content,
                                    data.brand === 'americanexpress'
                                    ? 'american express'
                                    : data.brand
                                    )
                            }
                            customGrid={{
                                gridTemplateColumns: 'auto 1fr auto',
                                gridRowGap: '5px',
                            }}
                            cellStyle={{
                                width: '100%',
                                height: '100%',
                                fontSize: '1.4rem',
                                textAlign: 'center',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                        />
                    </div>
                ))
            }
            
            {
                role !== '' && dataRows.map(data => (
                    <div
                        aria-label= 'table'
                        key={data.brand}
                        style={{marginTop:'20px'}}
                    >
                        <Table
                            data={
                                dataTable(
                                    data.content,
                                    data.brand === 'americanexpress'
                                    ? 'american express'
                                    : data.brand
                                    )
                            }
                            customGrid={{
                                gridTemplateColumns: 'auto 1fr auto',
                                gridRowGap: '5px',
                            }}
                            cellStyle={{
                                width: '100%',
                                height: '100%',
                                fontSize: '1.4rem',
                                textAlign: 'center',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default Rates
