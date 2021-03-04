import { db } from '../../Firebase/index';
import { formatDateUTC3 } from '@ziro/format-date-utc3';

const fetchPaidReceivables = async (zoopId, setIsError) => {
    try {
        const result = await db.collection('credit-card-payments').where("sellerZoopId", "==", zoopId).where("status", "!=", "Aguardando Pagamento").orderBy("status", "asc").get();

        const filter = []

        // Itera sobre cada DOC da collection credit-card-payments do vendedor logado
        result.forEach(doc => {
            const { status, receivables, transactionZoopId, datePaid, buyerRazao, charge, installments, cardFirstFour, cardLastFour } = doc.data();
            
            const formattedDatePaid = formatDateUTC3(datePaid.toDate());
            
            // Status de cada DOC da Collection credit-card-payments
            if(status === 'Aprovado' || status === 'Cancelado'){
                
                // Campo receivables de cada DOC da Collection credit-card-payments
                if(receivables !== undefined){
                    receivables.map(rec => {
                        const { status, split_rule, amount, installment, paid_at } = rec;

                        if(paid_at === null || paid_at === undefined) return // NÃO retirar esse if pois se retirar vai dar erro em docs que tiverem paid_at undefined por algum motivo.

                        if(paid_at !== null || paid_at !== undefined){
                            const sortDate = new Date(paid_at.seconds * 1000).getTime();
                            const formattedPaidAt = formatDateUTC3(paid_at.toDate());

                            // Se for pago e split_rule for nulo, adiciona o recebível em filter
                            if(status === 'paid' && !split_rule){
                                filter.push({
                                    transactionZoopId,
                                    recDate: formattedPaidAt,
                                    recAmount: amount,
                                    recInstallment: installment,
                                    buyerRazao,
                                    charge,
                                    installments,
                                    cardFirstFour,
                                    cardLastFour,
                                    datePaid: formattedDatePaid,
                                    sortDate
                                })
                            }
                        }else{
                            return console.log('erro.')
                        }
                    })
                }
            }
        });

        filter.sort((a, b) => b.sortDate - a.sortDate)

        setIsError(false);
        return filter;
    
    } catch (error) {
        console.log("Erro ao buscar recebíveis.", error)
        return setIsError(true);
    }
}

export default fetchPaidReceivables;