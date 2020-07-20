import React, { useState, useEffect, useContext } from 'react';
import md5 from 'md5';
import { useLocation } from 'wouter';
import { post } from 'axios';
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import ReceivableList from './ReceivableList/index';
import Transactions from './Transactions/index';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import currencyFormat from '@ziro/currency-format';
import { Menu } from '../Menu/index';
import { contentStyle, info, spinner, titleStyle } from './styles';
import fetch from './fetch';
import totalFetch from './totalFetch';
import { userContext } from '../appContext';
import banksList from '../Register/banks';


const Receivables = ({ receivableId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [receivables, setReceivables] = useState([]);
    const [blockBank, setBlockBank] = useState([]);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(-1);
    const [statusFilter, setStatusFilter] = useState('');
    const listStatus = ['Pago', 'Pendente'];
    const [currencyTotal, setCurrencyTotal] = useState('');
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [, setLocation] = useLocation();
    const { zoopId, codBank, holderName, accountType, accountNumber, agency } = useContext(userContext);

    const reducerTotal = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

    useEffect(() => totalFetch(setIsLoading, setErrorLoading, zoopId, setTotal), []);

    // useEffect(
    //     () => fetch(setIsLoading, setErrorLoading, setReceivables, zoopId, total, setData),
    //     [total],
    // );

    useEffect(
        () => {
            const getTotal = async () => {
                try {
                    let bank = banksList.find(bank => bank.split(' - ')[0] == codBank);
                    let bankName = bank ? bank.split(' - ')[1] : '';
                    setBlockBank(
                        [
                            {
                                header: 'Dados Bancários',
                                body: [
                                    {
                                        title: 'Titular',
                                        content: holderName
                                    },
                                    {
                                        title: 'Banco',
                                        content: bankName
                                    },
                                    {
                                        title: 'Agência',
                                        content: agency
                                    },
                                    {
                                        title: 'Conta Corrente',
                                        content: accountNumber
                                    },
                                    {
                                        title: 'Tipo',
                                        content: accountType
                                    }
                                ]
                            }
                        ]
                    );

                    const url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&limit=${total}`;
                    const recDocs = [];
                    const { data } = await post(
                        url,
                        {},
                        {
                            headers: {
                                Authorization: `${process.env.PAY_TOKEN}`,
                            },
                        });
                    const { items, total_amount } = data;
                    const currency = currencyFormat(`${total_amount}`.replace('.', ''));
                    setCurrencyTotal(currency);
                    const rows = [];
                    const rowsClicks = [];
                    const keys = Object.keys(items);
                    keys.map(key => {
                        let [ano, mes, dia] = key.split('-');
                        let date = [dia, mes, ano.substring(2)].join('/');
                        let id = md5(date).substring(10);
                        let total;
                        if (parseInt(items[key].total_amount) > 1)
                            total = currencyFormat(items[key].total_amount.replace('.', '')).replace('R$', '');
                        else {
                            let val = parseFloat(items[key].items.map(it => it.amount).reduce((a, b) => reducerTotal(a, b)) / 100);
                            total = currencyFormat(`${val}`.replace('.', '')).replace('R$', '');
                        }
                        rows.push([date, total, 'Detalhes', <Icon type="chevronRight" size={14} />]);
                        rowsClicks.push(() => setLocation(`/recebiveis/${id}`));
                        recDocs.push({
                            status: 'Aguardando Pagamento',
                            statusColor: '#F7BA00',
                            charge: currencyFormat(items[key].total_amount.replace('.', '')), //Começar aqui, montando o objeto
                            date,
                            items: items[key].items,
                            id
                        });
                    });
                    setData([{
                        title: 'Recebíveis',
                        header: ['Data', 'Valor(R$)', '', ''],
                        rows,
                        rowsClicks,
                        totals: ['-', currency.replace('R$', ''), '-', '-']
                    }]);
                    setReceivables(recDocs);
                    setIsLoading(false);
                } catch (error) {
                    if (error.response) console.log(error.response);
                    else console.log(error);
                    setErrorLoading(true);
                    setIsLoading(false);
                }
            };
            if (total > 0) getTotal();
        },
        [total],
    );

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );

    if (errorLoading) return <Error />;
    if (total === 0) return <>Nenhum recebível cadastrado</>

    if (receivableId) return <Transactions receivableId={receivableId} receivables={receivables} />

    return (
        <Menu title='Recebíveis'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridRowGap: '20px' }}>
                    <Details blocks={blockBank} />

                    <Dropdown
                        readOnly={true}
                        value={statusFilter || ''}
                        list={listStatus}
                        placeholder="Status da transferência"
                        onChange={({ target: { value } }) => {
                            if (listStatus.includes(value) || value === '') setIsLoadingResults(true);
                            setStatusFilter(value);
                        }}
                        onChangeKeyboard={e => {
                            if (listStatus.includes(e.value) || e.value === '') setIsLoadingResults(true);
                            setStatusFilter(e.value);
                        }}
                    />

                    <div style={info}>
                        <label style={titleStyle}>{(statusFilter === '' || statusFilter === 'Pendente') ? 'Valor à pagar' : 'Valor pago'}</label>
                        <label style={contentStyle}>{currencyTotal}</label>
                    </div>

                    {isLoadingResults ? (
                        <div style={spinner}>
                            <Spinner size="5rem" />
                        </div>
                    ) : (
                            <Table
                                data={data}
                                cellStyle={{
                                    maxWidth: '130px',
                                    width: '100%',
                                    height: '100%',
                                    fontSize: '1.4rem',
                                    textAlign: 'center',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer'
                                }}
                                customGrid={{
                                    gridTemplateColumns: 'auto 1fr 1fr 10px',
                                    gridRowGap: '15px'
                                }}
                            />
                        )}

                </div>

            </motion.div>
        </Menu>
    );
};

export default Receivables;


{/* <ReceivableList
                receivables={receivables}
                btnMoreClick={() => {
                    setLoadingMore(true);
                    setOffset(offset === 0 ? (offset + 1) + limit : offset + limit);
                    fetch(setIsLoading, setErrorLoading, receivables, setReceivables, zoopId, limit, offset === 0 ? ((offset + 1) + limit) : (offset + limit), setHasMore, setLoadingMore);
                }}
                hasMore={hasMore}
                loadingMore={loadingMore}
            /> */}
