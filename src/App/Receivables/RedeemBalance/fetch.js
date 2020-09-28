import axios, { post } from 'axios';
import { round } from '../../Transactions/utils';
import banksList from '../../Register/banks';

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};


const fetch = (setIsLoading, setIsError, { zoopId, setCurrentBalance, setRedeemBalance, setBlocks, codBank, holderName, accountType, accountNumber, agency }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            const balanceUrl = `${process.env.PAY_URL}account-balance-by-seller?seller_id=${zoopId}`;
            const { data: { items: { current_balance } } } = await post(balanceUrl, {}, config);
            const parts = current_balance.split('.');
            setRedeemBalance(parts[0]);
            const parsed = parseFloat(parts[0]) / 100;
            const rounded = (parseFloat(round(parsed, 2).toFixed(2)));
            setCurrentBalance(rounded);
            let bank = banksList.find(bank => bank.split(' - ')[0] == codBank);
            let bankName = bank ? bank.split(' - ')[1] : '';
            setBlocks(
                [
                    {
                        header: 'Conta para depósito',
                        body: [
                            {
                                title: 'Titular',
                                content: holderName
                            },
                            {
                                title: 'Banco',
                                content: bankName
                            },
                            {
                                title: 'Agência',
                                content: agency
                            },
                            {
                                title: 'Conta',
                                content: accountNumber
                            },
                            {
                                title: 'Tipo',
                                content: accountType
                            }
                        ]
                    }
                ]
            );
            setIsLoading(false);
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
            setIsError(true);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
