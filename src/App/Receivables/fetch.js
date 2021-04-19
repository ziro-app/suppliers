import React from 'react';
import axios, { post } from 'axios';
import md5 from 'md5';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import currencyFormat from '@ziro/currency-format';
import { round } from '../Transactions/utils';
import splitedArray from './utils/splitedArray';
import { formatDate, getFinalDate } from './utils/date';

const reducerTotal = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};

const fetch = (zoopId, initDate, totalAmount, totalTransactions, dataTable, days, receivables, { setIsLoading, setErrorLoading, setReceivables, setData, setLocation, setFinalDate, setHasMore, setLoadingMore, setTotalAmount, setDays, setTotalTransactions }) => {
    const source = axios.CancelToken.source();
    const fnDate = getFinalDate(initDate, 34);
    setFinalDate(fnDate);
    const parsedToday = formatDate(initDate);
    const parsedFnDay = formatDate(fnDate);
    const recDocs = [];
    const run = async () => {
        try {
            let hasMore = true;
            let offset = 0;
            let arrayItems = {};
            while (hasMore) {
                const url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&expected_on_range[gte]=${parsedToday}&expected_on_range[lte]=${parsedFnDay}&offset=${offset}`;
                const { data } = await post(url, {}, config);
                const { items, has_more } = data;
                const keys = Object.keys(items);
                if (offset !== 0) {
                    keys.map(key => {
                        if (key in arrayItems) arrayItems[key].items = [...arrayItems[key].items, ...items[key].items];
                        else arrayItems[key] = items[key];
                    });
                }
                else arrayItems = { ...arrayItems, ...items };
                if (items.length === 0) setHasMore(false);
                hasMore = has_more;
                offset += 100;
            }
            let totalAmountFetch = 0;
            let totalTransactionsFetch = 0;
            const rows = [];
            const rowsClicks = [];
            const keys = Object.keys(arrayItems);
            await Promise.all(keys.map(async (key, index) => {
                const [ano, mes, dia] = key.split('-');
                const date = [dia, mes, ano.substring(2)].join('/');
                const id = md5(date).substring(10);
                let total;
                // Array com tratamento para os splits
                // Todos o valores estão arredondados p/ 2 casas e em centavos
                const normalizedArray = await splitedArray(arrayItems[key].items, zoopId);

                const vendas = normalizedArray.length;
                // Check to add only days with postings
                if (vendas > 0) {
                    // Total do recebível -> Soma do valor líquido de todas as transações do dia
                    const val = (normalizedArray.length > 0) ? parseFloat(normalizedArray.map(it => it.net).reduce((a, b) => reducerTotal(a, b)) / 100).toFixed(2) : '0';
                    totalAmountFetch += parseFloat(val);
                    totalTransactionsFetch += vendas;

                    total = parseFloat(val).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

                    rows.splice(index, 0, [date, total.replace(/R\$\s/g, ''), vendas, <Icon type="chevronRight" size={14} />]);
                    rowsClicks.splice(index, 0, () => setLocation(`/recebiveis/${id}`));
                    recDocs.splice(index, 0, {
                        charge: total.replace(/\s/g, ''),
                        date,
                        completeDate: [dia, mes, ano].join('/'),
                        items: normalizedArray,
                        id
                    });
                }
            }));
            if (recDocs.length > 0) {
                const updatedTotalTransactions = totalTransactions + totalTransactionsFetch;
                const rounded = parseFloat(round(totalAmount + totalAmountFetch, 2).toFixed(2));
                const currency = currencyFormat(rounded.toFixed(2).replace('.', ''));
                setTotalAmount(rounded);
                setTotalTransactions(updatedTotalTransactions);

                setData([{
                    title: 'Valores à receber',
                    header: ['Data', 'Valor(R$)', 'Qntd vendas', ''],
                    rows: dataTable[0] && dataTable[0].rows ? [...dataTable[0].rows, ...rows] : rows,
                    rowsClicks: dataTable[0] && dataTable[0].rowsClicks ? [...dataTable[0].rowsClicks, ...rowsClicks] : rowsClicks,
                    totals: ['-', currency.replace('R$', ''), updatedTotalTransactions, '-']
                }]);
                setReceivables([...receivables, ...recDocs]);
                setDays(days + 30);
            } else setHasMore(false);
            setIsLoading(false);
            setLoadingMore(false);
        } catch (error) {
            console.log(error)
            if (error.response) console.log(error.response);
            setErrorLoading(true);
            setIsLoading(false);
            setLoadingMore(false);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
