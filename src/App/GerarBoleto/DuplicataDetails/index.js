import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Table from '@bit/vitorbarbosa19.ziro.table'
import Details from '@bit/vitorbarbosa19.ziro.details'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { containerWithPadding } from '@ziro/theme'
import currencyFormat from '@ziro/currency-format'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import Sucesso from './Sucesso/index'
import { buttonContainer, button } from './styles'
import matchStatusColor from '../utils/matchStatusColor'
import sendToBackend from './sendToBackend'
import BoletoDetails from '../BoletoDetails'
import BankInfo from '../BankInfo'
import convertCsv from './convertCsv'
import convertMoth from './convertMonth'


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
    const {status} = filtrado
    const sendUrl = filtrado.url
    useEffect(() => {
        let block
        let block2
        let dataTable
        const arrayTicket = filtrado.values.map(item => {
        return [
            item.venda || item.data_venda ? `${formatDateUTC3(convertMoth(item.venda || item.data_venda)).split(' ')[0].substring(0,6)}${formatDateUTC3(convertMoth(item.venda || item.data_venda)).split(' ')[0].substring(8,10)}` : '',
            item.romaneio || '-',
            item.lojista,
            currencyFormat(Math.round(item.receita * 100)).replace('R$',''),
            <Icon type='chevronRight' size={14} />
        ]})
        const arrayClickTicket = filtrado.values.map(item => () => setLocation(`/relatorio/${boletbankId}/${item.boletId || item.boleto}`))
        const somaReceitas = filtrado.values.map(item => item.receita).reduce((a,b) => a+b)
        const arrayRecebido = filtrado.values.map(item => item.recebido)
        const somaRecebido = arrayRecebido[0] ? arrayRecebido.reduce((a,b) => a+b) : NaN
        const datePayment = filtrado.date_payment ? `${formatDateUTC3(filtrado.date_payment.toDate()).split(' ')[0].substring(0,6)}${formatDateUTC3(filtrado.date_payment.toDate()).split(' ')[0].substring(8,10)}` : ''
        setTotalReceitas(Math.round(somaReceitas*100*100)/100)
                    dataTable = [
                        {
                            title: status === 'Comissões em Aberto' ? 'Comissões Pendentes' : 'Comissões',
                            header: ['Data', 'Roman.', 'Cliente', 'Receita', ''],
                            rows: arrayTicket,
                            rowsClicks: arrayClickTicket,
                            totals: ['-','-','-',currencyFormat(Math.round(somaReceitas * 100 *100)/100).replace('R$',''), '']
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
                                    content: currencyFormat(Math.round(somaReceitas * 100 *100)/100)
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
                                    title: 'Total Pago',
                                    content: status !== 'Pagamento Realizado' ? '-' : currencyFormat(Math.round(somaRecebido * 100)) || '-'
                                },  
                                {
                                    title: 'Total Comissões',
                                    content: currencyFormat(Math.round(somaReceitas * 100 *100)/100)
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
        setData(dataTable || [])
    }, [])
    if (isError) return <Error />
    if(boletId === 'transferencia_bancaria') return <BankInfo valorTotal={totalReceitas} duplicateId={boletbankId}/>
    if(boletId) return <BoletoDetails boletbankId={boletbankId} boletId={boletId} data={filtrado}/>
    if(url !== '') return <Sucesso urlBoleto={url}/>
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
                <input type="text" style={{ position: 'absolute', left: '-9999px' }} ref={textAreaRef} readOnly />
                <Header type='icon-link' title={filtrado.relatorio} navigateTo='relatorio' icon='back' />
                <div style={{ display: 'grid', gridRowGap: '12px' }}>
                    <Details blocks={blocks} />
                        <>
                            <Table cellStyle={{
                                maxWidth: '130px',
                                width: '100%',
                                height: '100%',
                                fontSize: '1.4rem',
                                textAlign: 'center',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer'
                            }} data={data} customGrid={{
                                gridTemplateColumns: 'auto 1fr 1fr 1fr 10px',
                                gridRowGap: '15px'
                            }} />
                        </>
                    {load ? (
                        <Spinner size="5rem" />
                        ):(
                            status === 'Comissões em Aberto' && url === '' ? (
                                    <div style={buttonContainer}>
                                    <Button
                                        style={button}
                                        type="link"
                                        cta="Pagar via transferência"
                                        navigate={() => setLocation(`/relatorio/${boletbankId}/transferencia_bancaria`)}
                                    />
                                    {totalReceitas <= 200000 &&
                                        <Button
                                            type="button"
                                            cta="Pagar via duplicata"
                                            click={sendToBackend(sellerId, totalReceitas,setUrl,filtrado,setLoad,transactions[0].fabricante, setIsError)}
                                        />
                                    }
                                    <Button
                                        type="button"
                                        cta="Exportar planilha"
                                        click={() => convertCsv(filtrado.values, 'relatorio.csv')}
                                    />
                                </div>
                                ) : (
                                    status === 'Aguardando Pagamento' && sendUrl !== '' ? (
                                        <div style={buttonContainer}>
                                            <Button
                                                type="button"
                                                cta="Visualizar Duplicata"
                                                click={() => window.open(sendUrl,'_blank')}
                                            />
                                            <Button
                                                type="button"
                                                cta="Exportar planilha"
                                                click={() => convertCsv(filtrado.values, 'relatorio.csv')}
                                            />  
                                        </div>
                                    ):(
                                        <> 
                                            <Button
                                                type="button"
                                                cta="Exportar planilha"
                                                click={() => convertCsv(filtrado.values, 'relatorio.csv')}
                                            />
                                        </>  
                                    )
                                )
                        )
                    }
                </div>
            </motion.div>
        );
}

export default DuplicateDetails