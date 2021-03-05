import { UnregisteredTransaction } from '../../Zoop';
export default (transaction: UnregisteredTransaction.Response) => ({
    transaction_id: transaction.id,
    on_behalf_of: transaction.on_behalf_of,
    amount: transaction.amount.replace('.', ''),
});
