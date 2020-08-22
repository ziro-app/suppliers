import { db } from '../../../Firebase/index';
import currencyFormat from '@ziro/currency-format';
import capitalize from '@ziro/capitalize';

const splitedArray = array => {
    let item = {};
    array.map(it => {
        const { id } = it;
        if (Object.keys(item).includes(id)) {
            const { amount, fees, net } = it;
            if (fees == 0) item[id]['split_value'] = amount;
            else item[id]['split_value'] = item[id]['amount'];
            item[id]['amount'] = `${parseInt(item[id]['amount']) + parseInt(amount)}`;
            item[id]['fees'] = `${parseInt(item[id]['fees']) + parseInt(fees)}`;
            item[id]['net'] = `${parseInt(item[id]['net']) + parseInt(net)}`;
            item[id]['split_rule'] = true;
        }
        else item[id] = { ...it };
    });
    let normalizedArray = Object.keys(item).map(it => item[it]);
    return normalizedArray;
}


const fetch = (receivables, receivableId, { setDate, setBlocks, setIsError, setCustomError, setIsLoading }) => {
    const run = async () => {
        try {
            const receivableEffect = receivables.find(receivable => receivable.id === receivableId);
            if (receivableEffect) {
                setDate(receivableEffect.date);
                let block = [];
                const normalizedArray = splitedArray(receivableEffect.items);
                await Promise.all(normalizedArray.map(async (transac, index) => {
                    const { id, amount, fees, net, installment_plan: { number_installments, installment_number }, split_rule, split_value } = transac;
                    const antiFraud = split_rule ? `- ${currencyFormat(split_value)}` : '-';
                    const netValue = split_rule && net ? `- ${currencyFormat(`${parseInt(net) - parseInt(split_value)}`)}` : '-';
                    block.push({
                        id,
                        header: `Venda ${index + 1}`,
                        body: [
                            {
                                title: 'Valor à pagar',
                                content: amount ? currencyFormat(amount) : '-',
                            },
                            {
                                title: 'Tarifa Ziro Pay',
                                content: fees ? `- ${currencyFormat(fees)}` : '-',
                            },
                            {
                                title: 'Tarifa Ziro Seguro Antifraude',
                                content: antiFraud,
                            },
                            {
                                title: 'Valor líquido',
                                content: netValue === '-' ? (net ? currencyFormat(net) : '-') : netValue,
                            },
                            {
                                title: 'Total de parcelas',
                                content: number_installments
                            },
                            {
                                title: 'Parcela à pagar',
                                content: installment_number ? installment_number : '1'
                            }
                        ],
                    });
                    const docsCollection = await db.collection('credit-card-payments').where('transactionZoopId', '==', transac.id).get();
                    if (!docsCollection.empty) {
                        const docRef = docsCollection.docs[0].id;
                        const { buyerRazao } = docsCollection.docs[0].data();
                        block[index]['docId'] = docRef;
                        block[index]['body'].unshift({
                            title: 'Lojista',
                            content: buyerRazao ? capitalize(buyerRazao) : '-'
                        });
                    }
                }
                ));
                setBlocks(block);
                setIsLoading(false);
            } else {
                setIsError(false);
                setCustomError(true);
                setIsLoading(false);
            }
        } catch (error) {
            setCustomError(false);
            setIsError(true);
            setIsLoading(false);
        }

    };

    run();
};

export default fetch;
