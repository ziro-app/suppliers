import React from 'react';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Table from '@bit/vitorbarbosa19.ziro.table';
import { useLocation } from 'wouter';
import { supportPhoneNumber } from "@bit/vitorbarbosa19.ziro.utils.support-phone-number";

import useLoadRates from './hooks/useLoadRates'

const Rates = () => {
    const [, setLocation] = useLocation();
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
        <div>
            <Details blocks={blockDetails} />
            {
                dataRows.map(data => (
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
                                gridTemplateColumns: '1fr 1fr 1fr',
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
