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
import RedeemBalance from './RedeemBalance/index';
import Transactions from './Transactions/index';
import { btn, cellStyle, contentStyle, customGrid, info, spinner, titleStyle } from './styles';
import fetch from './fetch';
import fetchBalance from './fetchBalance';
import convertCsv from './convertCsv';

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
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [days, setDays] = useState(0);
    const [balance, setBalance] = useState('');
    const [, setLocation] = useLocation();
    const history = createBrowserHistory();
    const setState = {
        setIsLoading, setErrorLoading, setReceivables, setData, setLocation,
        setHasMore, setLoadingMore, setInitDate, setFinalDate, setTotalAmount,
        setDays, setCustomError, setTotalTransactions, setBalance
    };
    const state = { receivables, hasMore, loadingMore, initDate, finalDate, totalAmount, days, totalTransactions, balance };
    const { zoopId, payoutAutomatic, fantasy } = useContext(userContext);

    const handleClick = () => {
        setLoadingMore(true);
        let day = new Date(finalDate);
        day.setDate(finalDate.getDate() + 1);
        setInitDate(day);
        fetch(zoopId, day, totalAmount, totalTransactions, data, days, receivables, fantasy, setState);
    };

    const mountTable = (tableRows, totalAmount, totalTransactions) => {
        let rows = [];
        let rowsClicks = [];
        tableRows.map(tableRow => {
            const { charge, date, id, items } = tableRow;
            rows.push([date, charge.replace('R$', ''), items.length, <Icon type="chevronRight" size={14} />]);
            rowsClicks.push(() => setLocation(`/recebiveis/${id}`));
        });
        setData([{
            title: 'Valores à receber',
            header: ['Data', 'Valor(R$)', 'Qntd vendas', ''],
            rows,
            rowsClicks,
            totals: ['-', currencyFormat(round(totalAmount, 2).toFixed(2).replace('.', '')), totalTransactions, '-']
        }]);
    };

    const useSnapshot = snapshot => {
        const { receivables, hasMore, loadingMore, initDate, finalDate, totalAmount, days, totalTransactions, balance } = snapshot;
        setReceivables(receivables);
        setHasMore(hasMore);
        setLoadingMore(loadingMore);
        setInitDate(new Date(initDate));
        setFinalDate(new Date(finalDate));
        setTotalAmount(totalAmount);
        setTotalTransactions(totalTransactions);
        setDays(days);
        setBalance(balance);
        mountTable(receivables, totalAmount, totalTransactions);
        localStorage.removeItem('snapshot');
        setIsLoading(false);
    };

    useEffect(() => {
        const { state } = history.location;
        const localSnapshot = localStorage.getItem('snapshot') ? JSON.parse(localStorage.getItem('snapshot')) : '';
        const snapshotMemo = (state && state.snapshot) ? state.snapshot : '';
        if (snapshotMemo) useSnapshot(snapshotMemo);
        else if (localSnapshot) useSnapshot(localSnapshot);
        else {
            fetchBalance(zoopId, setState);
            fetch(zoopId, initDate, totalAmount, totalTransactions, data, days, receivables, fantasy, setState);
        }
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

    if (receivableId && receivableId === 'resgate') return <RedeemBalance />

    if (receivableId && receivableId !== 'dados-bancarios') return <Transactions receivableId={receivableId} receivables={receivables} snapshot={state} />

    return (
        <Menu title='Recebíveis'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridRowGap: '20px' }}>
                    <Button cta="Configurar dados bancários" style={btn} navigate={() => setLocation('recebiveis/dados-bancarios')} type="link" />

                    {payoutAutomatic != undefined && payoutAutomatic != null && payoutAutomatic === false && <Button cta="Resgatar saldo" style={btn} navigate={() => setLocation('recebiveis/resgate')} type="link" />}

                    <Button cta="Exportar planilha" style={btn} click={() => convertCsv(receivables, totalAmount, totalTransactions, 'Recebiveis.csv')} type="button" />

                    <div style={{ marginTop: '10px' }}></div>
                    <div style={info}>
                        <label style={titleStyle}>À RECEBER HOJE</label>
                        <label style={contentStyle}>{balance ? currencyFormat(round(balance, 2).toFixed(2).replace('.', '')) : 'R$ 0,00'}</label>
                    </div>

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
