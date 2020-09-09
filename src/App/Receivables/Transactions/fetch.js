import capitalize from '@ziro/capitalize';

const currency = value => (parseFloat(value) / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '');

const fetch = (receivables, receivableId, { setDate, setBlocks, setIsError, setCustomError, setIsLoading }) => {
    const run = async () => {
        try {
            const receivableEffect = receivables.find(receivable => receivable.id === receivableId);
            if (receivableEffect) {
                setDate(receivableEffect.date);
                let block = [];
                receivableEffect.items.map((transac, index) => {
                    const { id, docRef, reason, amount, net, ziroPay, antifraud, installment_plan: { number_installments, installment_number } } = transac;
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
                                content: amount ? currency(amount) : 'R$0,00',
                            },
                            {
                                title: 'Tarifa Ziro Pay',
                                content: ziroPay ? `- ${currency(ziroPay)}` : '- R$0,00',
                            },
                            {
                                title: 'Tarifa Ziro Seguro Antifraude',
                                content: antifraud ? `- ${currency(antifraud)}` : '- R$0,00',
                            },
                            {
                                title: 'Valor líquido',
                                content: net ? `${currency(net)}` : 'R$0,00',
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
                });
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
