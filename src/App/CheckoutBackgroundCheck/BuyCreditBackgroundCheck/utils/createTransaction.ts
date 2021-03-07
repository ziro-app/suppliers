/* eslint-disable no-nested-ternary */
import axios from 'axios';

const createTransaction = async ({ sellerZoopId, charge, cardholder, month, year, prettyNumber, cvv, installments, seller }) => {
    const url = `${process.env.PAY_URL}payments-create`;
    console.log('url', url);
    const method = 'POST';
    const headers = {
        Authorization: `${process.env.PAY_TOKEN}`,
    };
    const data = {
        sendCompleteError:true,
        payment_type: 'credit',
        capture: true,
        on_behalf_of: sellerZoopId,
        source: {
            usage: 'single_use',
            amount: charge,
            currency: 'BRL',
            type: 'card',
            card: {
                holder_name: cardholder,
                expiration_month: month,
                expiration_year: year,
                card_number: prettyNumber,
                security_code: cvv,
            },
        },
        installment_plan: {
            mode: 'interest_free',
            number_installments: installments,
        },
        statement_descriptor: `${seller}`,
    };
    const { data: result } = await axios({ url, method, headers, data });
    console.log('result', result);
    return result;
};

export default createTransaction;
