import { db } from '../../../Firebase/index';
import capitalize from '@ziro/capitalize';

const currency = value => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');

const fetch = (receivables, receivableId, { setDate, setBlocks, setIsError, setCustomError, setIsLoading }) => {
    const run = async () => {
        try {
            const receivableEffect = receivables.find(receivable => receivable.id === receivableId);
            if (receivableEffect) {
                setDate(receivableEffect.date);
                let block = [];
                await Promise.all(receivableEffect.items.map(async (transac, index) => {
                    const { id, amount, fees, installment_plan: { number_installments, installment_number }, split_rule } = transac;
                    const docsCollection = await db.collection('credit-card-payments').where('transactionZoopId', '==', transac.id).get();
                    let antiFraudValue, markupValue, netValue, ziroPayValue, amountValue, docRef, reason;
                    if (!docsCollection.empty) {
                        docRef = docsCollection.docs[0].id;
                        const { buyerRazao, sellerZoopPlan, receivables: currentReceivables } = docsCollection.docs[0].data();
                        let antiFraud = sellerZoopPlan && sellerZoopPlan.antiFraud || null;
                        let markup = sellerZoopPlan && sellerZoopPlan.markup || null;
                        reason = buyerRazao;
                        if (split_rule) {
                            let installment = installment_number || 1;
                            const filteredReceivables = currentReceivables.filter(rec => rec.split_rule && rec.installment == installment);
                            const feesMarkup = filteredReceivables.filter(rec => markup && markup.id && rec.split_rule === markup.id);
                            const feesAntifraud = filteredReceivables.filter(rec => antiFraud && antiFraud.id && rec.split_rule === antiFraud.id);
                            antiFraudValue = (feesAntifraud && feesAntifraud.length > 0) ? parseFloat(feesAntifraud[0].amount) : 0;
                            markupValue = (feesMarkup && feesMarkup.length > 0) ? parseFloat(feesMarkup[0].amount) : 0;
                        }
                        ziroPayValue = markupValue ? ((parseFloat(fees) / 100) + markupValue) : parseFloat(fees) / 100;
                        netValue = antiFraudValue ? (parseFloat(amount) / 100) - ziroPayValue - antiFraudValue : (parseFloat(amount) / 100) - ziroPayValue;
                        amountValue = parseFloat(amount) / 100;
                    }
                    block.push({
                        id,
                        docId: docRef,
                        header: `Venda ${index + 1}`,
                        body: [
                            {
                                title: 'Lojista',
                                content: reason ? capitalize(reason) : '-',
                            },
                            {
                                title: 'Valor à pagar',
                                content: amountValue ? currency(amountValue) : '- R$0,00',
                            },
                            {
                                title: 'Tarifa Ziro Pay',
                                content: ziroPayValue ? `- ${currency(ziroPayValue)}` : '- R$0,00',
                            },
                            {
                                title: 'Tarifa Ziro Seguro Antifraude',
                                content: antiFraudValue ? `- ${currency(antiFraudValue)}` : '- R$0,00',
                            },
                            {
                                title: 'Valor líquido',
                                content: netValue ? `${currency(netValue)}` : 'R$0,00',
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
            console.log(error);
            setCustomError(false);
            setIsError(true);
            setIsLoading(false);
        }

    };

    run();
};

export default fetch;
