import React from 'react';
import axios, { post } from 'axios';
import md5 from 'md5';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import currencyFormat from '@ziro/currency-format';
import { formatDateUTC3 } from '@ziro/format-date-utc3';
import { round } from '../Transactions/utils';
import { db } from '../../Firebase/index';

const reducerTotal = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

const getFinalDate = (today, days) => {
    let newDate = new Date(today);
    newDate.setDate(today.getDate() + days);
    return newDate;
};

const formatDate = date => `${date.getFullYear()}-${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()}`;

const splitedArray = async array => {
    let item = {};
    await Promise.all(array.map(async it => {
        const { id, installment_plan, fees } = it;
        if (!Object.keys(item).includes(id) && installment_plan) {
            const { number_installments, installment_number } = installment_plan;
            const docsCollection = await db.collection('credit-card-payments').where('transactionZoopId', '==', id).get();
            let antiFraudValue, markupValue, netValue, ziroPayValue;
            if (!docsCollection.empty) {
                const { buyerRazao, sellerZoopPlan, receivables: currentReceivables } = docsCollection.docs[0].data();
                let antiFraud = sellerZoopPlan && sellerZoopPlan.antiFraud || null;
                let markup = sellerZoopPlan && sellerZoopPlan.markup || null;
                let installment = installment_number || 1;
                const filteredReceivables = currentReceivables.filter(rec => rec.split_rule && rec.installment == installment);
                const totalAmount = currentReceivables.filter(rec => rec.installment == installment).map(rec => rec.split_rule ? rec.amount : rec.gross_amount).reduce((a, b) => parseFloat(a) + parseFloat(b));
                const roundedTotal = round(totalAmount, 2);
                const feesMarkup = filteredReceivables.filter(rec => markup && markup.id && rec.split_rule === markup.id);
                const feesAntifraud = filteredReceivables.filter(rec => antiFraud && antiFraud.id && rec.split_rule === antiFraud.id);
                antiFraudValue = (feesAntifraud && feesAntifraud.length > 0) ? parseFloat(feesAntifraud[0].amount) : 0;
                antiFraudValue = round(antiFraudValue, 2);
                markupValue = (feesMarkup && feesMarkup.length > 0) ? parseFloat(feesMarkup[0].amount) : 0;
                markupValue = round(markupValue, 2);
                ziroPayValue = markupValue ? ((parseFloat(fees) / 100) + markupValue) : parseFloat(fees) / 100;
                netValue = antiFraudValue ? totalAmount - ziroPayValue - antiFraudValue : (totalAmount) - ziroPayValue;
                netValue = round(netValue, 2);

                if (item[id]) {
                    item[id]['amount'] = `${parseInt(item[id]['amount']) + parseInt(`${roundedTotal.toFixed(2)}`.replace('.', ''))}`;
                    item[id]['antifraud'] = `${parseInt(item[id]['antifraud']) + parseInt(`${antiFraudValue.toFixed(2)}`.replace('.', ''))}`;
                    item[id]['installment_plan']['installment_number'] = `${item[id]['installment_plan']['installment_number']}, ${installment}`;
                    item[id]['markup'] = `${parseInt(item[id]['markup']) + parseInt(`${markupValue.toFixed(2)}`.replace('.', ''))}`;
                    item[id]['net'] = `${parseInt(item[id]['net']) + parseInt(`${netValue.toFixed(2)}`.replace('.', ''))}`;
                    item[id]['ziroPay'] = `${parseInt(item[id]['ziroPay']) + parseInt(`${ziroPayValue.toFixed(2)}`.replace('.', ''))}`;
                }
                else {
                    item[id] = {
                        id,
                        docRef: docsCollection.docs[0].id,
                        reason: buyerRazao,
                        amount: `${roundedTotal.toFixed(2)}`.replace('.', ''),
                        net: `${netValue.toFixed(2)}`.replace('.', ''),
                        markup: `${markupValue.toFixed(2)}`.replace('.', ''),
                        ziroPay: `${ziroPayValue.toFixed(2)}`.replace('.', ''),
                        antifraud: `${antiFraudValue.toFixed(2)}`.replace('.', ''),
                        installment_plan: { number_installments, installment_number: installment }
                    };
                }
            }
        }
    }));
    let normalizedArray = Object.keys(item).map(it => item[it]);
    return normalizedArray;
}

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};

const updateFirebase = async () => await db.collection('credit-card-payments').doc('kH54IbWjLx3q2w0ZvU4v').update({
    status: "Pré Autorizado",
    installments: "3",
    datePaid: new Date("2020-11-17 15:40:00"),
    dateLastUpdate: new Date("2020-11-17 15:40:00"),
    cardBrand: "MasterCard",
    cardholder: "tamara c l oliveira",
    cardFirstFour: "5536",
    cardLastFour: "8799",
    transactionZoopId: "4fdc9a3583874df19e53560558101503",
    receiptId: "fcf7bd54919a476eb446646414d6db85",
    splitTransaction: {
        antiFraud: { amount: 0, percentage: 0 },
        markup: { amount: 0, percentage: 0 },
    },
    authorizer: "rede",
    onBehalfOfBrand: "",
    buyerStoreownerId: "naldrbxUCq5NGpbLIZQb",
    buyerRazao: "TMOLIVEIRA COMERCIO DE ROUPAS LTDA"
});

const updateSheet = async () => {
    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    };
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: "1FxCECEMVa66vpHsmucgFow6DVPpCGHgOiIfthEzJwPc",
        range: 'Transacoes!A1',
        resource: {
            values: [
                [
                    "4fdc9a3583874df19e53560558101503",
                    formatDateUTC3(new Date("2020-11-17T18:40:20+00:00")),
                    "Pré Autorizado",
                    "crédito",
                    "3",
                    "Closet Deluxe",
                    "TMOLIVEIRA COMERCIO DE ROUPAS LTDA",
                    "tamara c l oliveira",
                    "MasterCard",
                    `5536...8799`,
                    "9.616,70"
                ]
            ]
        },
        valueInputOption: 'user_entered'
    };
    return await post(url, body, config);
};

const fetch = (zoopId, initDate, totalAmount, totalTransactions, dataTable, days, receivables, { setIsLoading, setErrorLoading, setReceivables, setData, setLocation, setFinalDate, setHasMore, setLoadingMore, setTotalAmount, setDays, setCustomError, setTotalTransactions }) => {
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
                let url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&expected_on_range[gte]=${parsedToday}&expected_on_range[lte]=${parsedFnDay}&offset=${offset}`;
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
                if (!(items.length === 0) && offset === 0) setDays(days + 30);
                hasMore = has_more;
                offset += 100;
            }
            let totalAmountFetch = 0;
            let totalTransactionsFetch = 0;
            const rows = [];
            const rowsClicks = [];
            const keys = Object.keys(arrayItems);
            if (keys.length === 0 && receivables.length === 0) throw { customError: true };
            await Promise.all(keys.map(async (key, index) => {
                let [ano, mes, dia] = key.split('-');
                let date = [dia, mes, ano.substring(2)].join('/');
                let id = md5(date).substring(10);
                let total;
                // Array com tratamento para os splits
                // Todos o valores estão arredondados p/ 2 casas e em centavos
                let normalizedArray = await splitedArray(arrayItems[key].items);

                let vendas = normalizedArray.length;
                // Total do recebível -> Soma do valor líquido de todas as transações do dia
                let val = (normalizedArray.length > 0) ? parseFloat(normalizedArray.map(it => it.net).reduce((a, b) => reducerTotal(a, b)) / 100).toFixed(2) : '0';
                totalAmountFetch += parseFloat(val);
                totalTransactionsFetch += vendas;

                total = currencyFormat(`${val}`.replace('.', '')).replace('R$', '');

                rows.splice(index, 0, [date, total, vendas, <Icon type="chevronRight" size={14} />]);
                rowsClicks.splice(index, 0, () => setLocation(`/recebiveis/${id}`));
                recDocs.splice(index, 0, {
                    charge: currencyFormat(`${val}`.replace('.', '')),
                    date,
                    completeDate: [dia, mes, ano].join('/'),
                    items: normalizedArray,
                    id
                });
            }));

            // await updateFirebase();
            // await updateSheet();

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
            setIsLoading(false);
            setLoadingMore(false);
        } catch (error) {
            console.log(error)
            if (error.response) console.log(error.response);
            else console.log(error);
            if (error.customError) {
                setErrorLoading(false);
                setIsLoading(false);
                setLoadingMore(false);
                setCustomError(true);
            } else {
                setErrorLoading(true);
                setIsLoading(false);
                setLoadingMore(false);
                setCustomError(false);
            }
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
