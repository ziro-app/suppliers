import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { createBrowserHistory } from 'history';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import currencyFormat from '@ziro/currency-format';
import { Menu } from '../Menu/index';
import { round } from '../Transactions/utils';
import { userContext } from '../appContext';
import BankInfo from './BankInfo/index';
import Transactions from './Transactions/index';
import { btn, cellStyle, contentStyle, customGrid, info, spinner, titleStyle } from './styles';
import fetch from './fetch';

const Receivables = ({ receivableId }) => {
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
    const [days, setDays] = useState(0);
    const [, setLocation] = useLocation();
    const history = createBrowserHistory();
    const setState = {
        setIsLoading, setErrorLoading, setReceivables, setData, setLocation,
        setHasMore, setLoadingMore, setInitDate, setFinalDate, setTotalAmount,
        setDays, setCustomError
    };
    const state = { receivables, hasMore, loadingMore, initDate, finalDate, totalAmount, days };
    const { zoopId } = useContext(userContext);

    const handleClick = () => {
        setLoadingMore(true);
        let day = new Date(finalDate);
        day.setDate(finalDate.getDate() + 1);
        setInitDate(day);
        fetch(zoopId, day, totalAmount, data, days, receivables, setState);
    };

    const mountTable = (tableRows, total) => {
        let rows = [];
        let rowsClicks = [];
        tableRows.map(tableRow => {
            const { charge, date, id, items } = tableRow;
            rows.push([date, charge.replace('R$', ''), items.length, <Icon type="chevronRight" size={14} />]);
            rowsClicks.push(() => setLocation(`/recebiveis/${id}`));
        });
        setData([{
            title: 'Recebíveis',
            header: ['Data', 'Valor(R$)', 'Qntd vendas', ''],
            rows,
            rowsClicks,
            totals: ['-', currencyFormat(`${total}`.replace('.', '')).replace('R$', ''), '-', '-']
        }]);
    };

    useEffect(() => {
        const { state } = history.location;
        const snapshotMemo = (state && state.snapshot) ? state.snapshot : '';
        if (snapshotMemo) {
            const { receivables, hasMore, loadingMore, initDate, finalDate, totalAmount, days } = snapshotMemo;
            setReceivables(receivables);
            setHasMore(hasMore);
            setLoadingMore(loadingMore);
            setInitDate(initDate);
            setFinalDate(finalDate);
            setTotalAmount(totalAmount);
            setDays(days);
            mountTable(receivables, totalAmount);
            setIsLoading(false);
        }
        else fetch(zoopId, initDate, totalAmount, data, days, receivables, setState);
    }, []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );

    if (errorLoading) return <Error />;

    if (customError) return (
        <Error
            message="Nenhum recebível cadastrado até o momento"
            type="noData"
            title="Recebíveis"
            backRoute="/transacoes"
            backRouteFunction={route => setLocation(route)}
        />
    );

    if (receivableId && receivableId === 'dados-bancarios') return <BankInfo />

    if (receivableId && receivableId !== 'dados-bancarios') return <Transactions receivableId={receivableId} receivables={receivables} snapshot={state} />

    return (
        <Menu title='Recebíveis'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridRowGap: '20px' }}>
                    <Button cta="Configurar Dados Dancários" style={btn} navigate={() => setLocation('recebiveis/dados-bancarios')} type="link" />

                    <div style={info}>
                        <label style={titleStyle}>À RECEBER EM {days} DIAS</label>
                        <label style={contentStyle}>{currencyFormat(round(totalAmount, 2).toFixed(2).replace('.', ''))}</label>
                    </div>

                    <Table
                        data={data}
                        cellStyle={cellStyle}
                        customGrid={customGrid}
                    />

                    {hasMore && !loadingMore && <Button cta="Carregar mais" click={handleClick} type="button" />}
                    {hasMore && loadingMore && <Spinner size="4rem" />}
                </div>

            </motion.div>
        </Menu>
    );
};

export default Receivables;
