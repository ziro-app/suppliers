import React from 'react';
import axios, { post } from 'axios';
import md5 from 'md5';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import currencyFormat from '@ziro/currency-format';

const reducerTotal = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

const fetch = (zoopId, total, { setIsLoading, setErrorLoading, setCurrencyTotal, setReceivables, setData, setLocation }) => {
    const source = axios.CancelToken.source();
    const url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&limit=${total}`;
    const recDocs = [];
    const run = async () => {
        if (total > 0) {
            try {
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
                        charge: currencyFormat(items[key].total_amount.replace('.', '')),
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
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
