import getDocInfo from './getDocInfo';
import { round } from '../../Transactions/utils';

const splitedArray = async (array, fantasy) => {
    // Remember -> The commissions from Zoop come with the installment_plan field null,
    // so you are not entering the values shown on this screen. These releases come
    // with payment_type === 'commission'
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
            // All postings enter this case, except for the splits that are also posted
            // to the appropriate EC's, unlike the owner of the sale
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
            // In the future, a treatment can be added for accounting for splits
            else return null
        } else return null;
    }));
    const payments = {};
    firebaseObjs
        .filter(obj => obj !== null)
        .map(paymentInfo => {
            const { id, amount, antifraud,
                installment_plan: { number_installments, installment_number },
                markup, net, ziroPay } = paymentInfo;
            if (!payments[id]) {
                payments[id] = { ...paymentInfo, installment_plan: { number_installments, installment_number: [installment_number || 1] } };
            }
            else if (payments[id] && !payments[id]['installment_plan']['installment_number'].includes(parseInt(installment_number))) {
                payments[id]['amount'] = `${parseInt(payments[id]['amount']) + parseInt(amount)}`;
                payments[id]['antifraud'] = `${parseInt(payments[id]['antifraud']) + parseInt(antifraud)}`;
                payments[id]['installment_plan']['installment_number'] = [...payments[id]['installment_plan']['installment_number'], parseInt(installment_number)];
                payments[id]['markup'] = `${parseInt(payments[id]['markup']) + parseInt(markup)}`;
                payments[id]['net'] = `${parseInt(payments[id]['net']) + parseInt(net)}`;
                payments[id]['ziroPay'] = `${parseInt(payments[id]['ziroPay']) + parseInt(ziroPay)}`;
            }
        });
    const normalizedArray = Object.keys(payments).map(it => payments[it]);
    return normalizedArray;
};

export default splitedArray;
