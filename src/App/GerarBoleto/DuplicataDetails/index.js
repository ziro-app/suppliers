import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Table from '@bit/vitorbarbosa19.ziro.table'
import Details from '@bit/vitorbarbosa19.ziro.details'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import Sucesso from './Sucesso/index'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { containerWithPadding } from '@ziro/theme'
import currencyFormat from '@ziro/currency-format'
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import { buttonContainer } from './styles'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import matchStatusColor from '../utils/matchStatusColor'
import sendToBackend from './sendToBackend'
import BoletoDetails from '../BoletoDetails'
import BankInfo from '../BankInfo'


const DuplicateDetails = ({transactions,boletbankId,boletId,sellerId}) => {
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [totalReceitas, setTotalReceitas] = useState();
    const [url, setUrl] = useState('');
    const [load, setLoad] = useState(false);
    const [isError, setIsError] = useState(false)
    const [, setLocation] = useLocation();
    const textAreaRef = useRef(null);
    const [filtrado] = transactions.filter(item => String(item.id) === boletbankId)
    filtrado.values.sort((a,b) => new Date(a.venda) < new Date(b.venda) ? -1 : 1)
    const status = filtrado.status
    const sendUrl = filtrado.url
    useEffect(() => {
        let block
        let block2
        let dataTable
        const arrayTicket = filtrado.values.map(item => {
        return [
            item.venda || item.data_venda ? formatDateUTC3(new Date(item.venda || item.data_venda)).split(' ')[0].substring(0,8) : '',
            item.romaneio || '-',
            item.lojista,
            currencyFormat(Math.round(item.receita * 100)).replace('R$',''),
            <Icon type='chevronRight' size={14} />
        ]})
        const arrayClickTicket = filtrado.values.map(item => () => setLocation(`/relatorio/${boletbankId}/${item.boletId || item.boleto}`))
        const somaReceitas = filtrado.values.map(item => item.receita).reduce((a,b) => a+b)
        const datePayment = filtrado.date_payment ? formatDateUTC3(filtrado.date_payment.toDate()).split(' ')[0].substring(0,8) : ''
        setTotalReceitas(Math.round(somaReceitas*100))
                    dataTable = [
                        {
                            title: status === 'Comissões em Aberto' ? 'Comissões Pendentes' : 'Comissões',
                            header: ['Data', 'Roman.', 'Cliente', 'Receita', ''],
                            rows: arrayTicket,
                            rowsClicks: arrayClickTicket,
                            totals: ['-','-','-',currencyFormat(Math.round(somaReceitas*100)).replace('R$',''), '']
                        }
                    ]
                    block = [
                        {
                            header: 'sumário',
                            body: [
                                {
                                    title: 'Endereço',
                                    content: filtrado.endereco
                                },
                                {
                                    title: 'Total',
                                    content: currencyFormat(Math.round(somaReceitas*100))
                                },
                                {
                                    title: 'Status',
                                    content: status,
                                    color: matchStatusColor(status)
                                },
                            ]
                        }
                    ]
                    block2 = [
                    {
                        header: 'sumário',
                        body: [
                                {
                                    title: 'Endereço',
                                    content: filtrado.endereco
                                },
                                {
                                    title: 'Data',
                                    content: status !== 'Pagamento Realizado' ? '-' : datePayment
                                },
                                {
                                    title: 'Total Comissões',
                                    content: currencyFormat(somaReceitas * 100)
                                },
                                {
                                    title: 'Status',
                                    content: status,
                                    color: matchStatusColor(status)
                                },
                            ]
                        }
                    ]
        setBlocks(status === 'Comissões em Aberto' ? block : block2)
        setData(dataTable ? dataTable : [])
    }, [])
    if (isError) return <Error />
    if(boletId === 'transferencia_bancaria') return <BankInfo valorTotal={totalReceitas}/>
    if(boletId) return <BoletoDetails boletbankId={boletbankId} boletId={boletId} data={filtrado}/>
    if(url !== '') return <Sucesso urlBoleto={url}/>
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
                <input type="text" style={{ position: 'absolute', left: '-9999px' }} ref={textAreaRef} readOnly />
                <Header type='icon-link' title={filtrado.relatorio} navigateTo='relatorio' icon='back' />
                <div style={{ display: 'grid', gridRowGap: '12px' }}>
                    <Details blocks={blocks} />
                        <>
                            <Table data={data} customGrid={{
                                gridTemplateColumns: 'auto 1fr 1fr 1fr 10px',
                                gridRowGap: '15px'
                            }} />
                        </>
                    {load ? (
                        <Spinner size="5.5rem" />
                        ):(
                            status === 'Comissões em Aberto' && url === '' ? (
                                    <div style={buttonContainer}>
                                    <Button
                                        type="link"
                                        cta="Fazer Transferência"
                                        navigate={() => setLocation(`/relatorio/${boletbankId}/transferencia_bancaria`)}
                                    />
                                    {totalReceitas/100 <= 2000 &&
                                        <Button
                                        type="button"
                                        cta="Gerar Duplicata"
                                        click={sendToBackend(sellerId, totalReceitas,setUrl,filtrado,setLoad,transactions[0].fabricante, setIsError)}
                                        />
                                    }
                                </div>
                                ) : (
                                    status === 'Aguardando Pagamento' && sendUrl !== '' ? (
                                        <div style={buttonContainer}>
                                        <Button
                                            type="button"
                                            cta="Visualizar Duplicata"
                                            click={() => window.open(sendUrl,'_blank')}
                                        />
                                    </div>
                                    ):(
                                        <> </>
                                    )
                                )
                        )
                    }
                </div>
            </motion.div>
        );
}

export default DuplicateDetails