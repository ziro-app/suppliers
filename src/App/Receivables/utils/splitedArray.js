import getDocInfo from './getDocInfo';
import { round } from '../../Transactions/utils';

const splitedArray = async (array, fantasy, zoopId) => {
    const result = array.filter(({ installment_plan }) => installment_plan).map(({ id, installment_plan, fees }) => ({ id, installment_plan, fees }));
    const firebaseObjs = await Promise.all(result.map(async ({ id, installment_plan, fees }) => {
        const data = await getDocInfo(id);
        if (data) {
            const { seller, buyerRazao, sellerZoopPlan, receivables, splitTransaction, docRef } = data;
            const { number_installments, installment_number } = installment_plan;
            const splits = splitTransaction ?? sellerZoopPlan;
            const antiFraud = splits?.antiFraud ?? null;
            const markup = splits?.markup ?? null;
            const installment = parseInt(installment_number) || 1;
            let antiFraudValue, markupValue, netValue, ziroPayValue;
            // All ECs enter this case, except for Ziro who receives the splits
            if (seller.toUpperCase() === fantasy) {
                const filteredReceivables = receivables.filter(rec => rec.split_rule && rec.installment == installment);
                const totalAmount = receivables.filter(rec => rec.installment == installment).map(rec => rec.split_rule ? rec.amount : rec.gross_amount).reduce((a, b) => parseFloat(a) + parseFloat(b));
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

                return {
                    id,
                    docRef,
                    reason: buyerRazao,
                    amount: `${roundedTotal.toFixed(2)}`.replace('.', ''),
                    net: `${netValue.toFixed(2)}`.replace('.', ''),
                    markup: `${markupValue.toFixed(2)}`.replace('.', ''),
                    ziroPay: `${ziroPayValue.toFixed(2)}`.replace('.', ''),
                    antifraud: `${antiFraudValue.toFixed(2)}`.replace('.', ''),
                    installment_plan: { number_installments, installment_number: installment }
                };
            }
            // Receipt of the splits, only the values of the fees are added because
            // the purchase amount is received by the EC 'owner' of the transaction
            else {
                const filteredReceivables = receivables.filter(rec => rec.split_rule && rec.installment == installment && rec.recipient === zoopId);
                const roundedTotal = round(0, 2);
                const feesMarkup = filteredReceivables.filter(rec => markup && markup.id && rec.split_rule === markup.id);
                const feesAntifraud = filteredReceivables.filter(rec => antiFraud && antiFraud.id && rec.split_rule === antiFraud.id);
                antiFraudValue = (feesAntifraud && feesAntifraud.length > 0) ? parseFloat(feesAntifraud[0].amount) : 0;
                antiFraudValue = round(antiFraudValue, 2);
                markupValue = (feesMarkup && feesMarkup.length > 0) ? parseFloat(feesMarkup[0].amount) : 0;
                markupValue = round(markupValue, 2);
                ziroPayValue = markupValue ? ((parseFloat(fees) / 100) + markupValue) : parseFloat(fees) / 100;
                netValue = antiFraudValue ? ziroPayValue + antiFraudValue : ziroPayValue;
                netValue = round(netValue, 2);

                return {
                    id,
                    docRef,
                    reason: buyerRazao,
                    amount: `${roundedTotal.toFixed(2)}`.replace('.', ''),
                    net: `${netValue.toFixed(2)}`.replace('.', ''),
                    markup: `${markupValue.toFixed(2)}`.replace('.', ''),
                    ziroPay: `${ziroPayValue.toFixed(2)}`.replace('.', ''),
                    antifraud: `${antiFraudValue.toFixed(2)}`.replace('.', ''),
                    installment_plan: { number_installments, installment_number: installment },
                    split: true
                };
            }
        } else return null;
    }));
    let test = {};
    firebaseObjs
        .filter(it => it !== null)
        .map(it => {
            const { id, amount, antifraud,
                installment_plan: { number_installments, installment_number },
                markup, net, ziroPay } = it;
            if (!test[id]) {
                test[id] = { ...it, installment_plan: { number_installments, installment_number: [parseInt(installment_number) || 1] } };
            }
            if (test[id] && !test[id]['installment_plan']['installment_number'].includes(parseInt(installment_number))) {
                test[id]['amount'] = `${parseInt(test[id]['amount']) + parseInt(amount)}`;
                test[id]['antifraud'] = `${parseInt(test[id]['antifraud']) + parseInt(antifraud)}`;
                test[id]['installment_plan']['installment_number'] = [...test[id]['installment_plan']['installment_number'], parseInt(installment_number)];//`${test[id]['installment_plan']['installment_number']}, ${installment_number}`;
                test[id]['markup'] = `${parseInt(test[id]['markup']) + parseInt(markup)}`;
                test[id]['net'] = `${parseInt(test[id]['net']) + parseInt(net)}`;
                test[id]['ziroPay'] = `${parseInt(test[id]['ziroPay']) + parseInt(ziroPay)}`;
            }
        });
    const normalizedArray = Object.keys(test).map(it => test[it]);
    return normalizedArray;
};

export default splitedArray;
