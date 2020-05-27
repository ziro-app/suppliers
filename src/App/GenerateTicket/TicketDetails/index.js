import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Sucesso from './Sucesso/index'
import Button from '@bit/vitorbarbosa19.ziro.button';
import { alertColor, containerWithPadding, successColor } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import { userContext } from '../../appContext';
import { button, custom, illustrationContainer, buttonContainer } from './styles';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import matchStatusColor from '../matchStatusColor'
import sendToBackend from './sendToBackend'
import moment from 'moment'
import 'moment/locale/pt-br'
import DetailsBoleto from '../boletidDetails'


const TransactionDetails = ({transactions,boletbankId,boletId,sellerId}) => {
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [transaction, setTransaction] = useState({});
    const [totalReceitas, setTotalReceitas] = useState();
    const [url, setUrl] = useState('');
    const [load, setLoad] = useState(false);
    const [, setLocation] = useLocation();
    const textAreaRef = useRef(null);
    const filtrado = transactions.filter(item => String(item.id) === boletbankId)
    const status = filtrado[0].status
    const sendUrl = filtrado[0].url
    useEffect(() => {
        const stringToNumber = (numero) => {
            if(typeof numero === 'number'){
                return Number(numero)*100
            }else{
                return Number((numero.replace('.','')).replace(',','.'))*100
            }
        }
        let block;
        let block2;
        let dataTable;
        const arrayTicket = filtrado[0].values.map(item => [moment(item.venda, 'DD/MMM./YYYY').format("DD/MM/YY") !== 'Invalid date' ? moment(item.venda, 'DD/MMM./YYYY').format("DD/MM/YY") : moment(item.data_venda, 'DD/MMM./YYYY').format("DD/MM/YY"), item.romaneio || '-', item.lojista, currencyFormat(stringToNumber(item.valor)).replace('R$', '')])
        const arrayClickTicket = filtrado[0].values.map(item => () => setLocation(`/relatorio/${boletbankId}/${item.boletId || item.boleto}`))
        const totalVendas = filtrado[0].values.map(item => stringToNumber(item.valor)).reduce((a,b) => a+b)
        const totalReceitas = filtrado[0].values.map(item => stringToNumber(item.receita)).reduce((a,b) => a+b)
        setTotalReceitas(totalReceitas)
                    dataTable = [
                        {
                            title: status === 'Comissões em Aberto' ? 'Comissões Pendentes' : 'Comissões',
                            header: ['Data', 'Romaneio', 'Cliente', 'Venda'],
                            rows: arrayTicket,
                            rowsClicks: arrayClickTicket,
                            totals: ['-','-','-',currencyFormat(totalVendas).replace('R$','')]
                        }
                    ]
                    block = [
                        {
                            header: 'sumário',
                            body: [
                                {
                                    title: 'Total',
                                    content: currencyFormat(totalReceitas)
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
                                    title: 'Data',
                                    content: status === 'Aguardando Pagamento' ? '-' : filtrado[0].date_payment
                                },
                                {
                                    title: 'Total',
                                    content: currencyFormat(totalReceitas)
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
    if(boletId) return <DetailsBoleto boletbankId={boletbankId} boletId={boletId} data={filtrado[0]}/>
    if(url !== '') return <Sucesso urlBoleto={url}/>
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
                <input type="text" style={{ position: 'absolute', left: '-9999px' }} ref={textAreaRef} readOnly />
                <Header type='icon-link' title={filtrado[0].relatorio} navigateTo='relatorio' icon='back' />
                <div style={{ display: 'grid', gridRowGap: '12px' }}>
                    <Details blocks={blocks} />
                        <>
                            <Table data={data} customGrid={{
                                gridTemplateColumns: 'auto 1fr 1fr 1fr',
                                gridRowGap: '15px'
                            }} />
                        </>
                    {load ? (
                        <Spinner size="5.5rem" />
                        ):(
                            status === 'Comissões em Aberto' ? (
                                    <div style={buttonContainer}>
                                    <Button
                                        type="button"
                                        cta="Gerar Boleto"
                                        style={button}
                                        click={sendToBackend(sellerId, totalReceitas,setUrl,filtrado[0],setLoad)}
                                    />
                                </div>
                                ) : (
                                    status === 'Aguardando Pagamento' &&   
                                    <div style={buttonContainer}>
                                    <Button
                                        type="button"
                                        cta="Link do Boleto"
                                        style={button}
                                        click={() => window.open(sendUrl,'_blank')}
                                    />
                                </div>
                                )
                        )
                    }
                </div>
            </motion.div>
        );
}

export default TransactionDetails