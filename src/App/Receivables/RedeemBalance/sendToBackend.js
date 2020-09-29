import { post } from 'axios';

const sendToBackend = state => () => {
    const { zoopBankAccountId, currentBalance, redeemBalance,
        setCurrentBalance, setRedeemBalance } = state;
    const redeemParsed = parseFloat(redeemBalance) / 100;
    return new Promise(async (resolve, reject) => {
        try {
            if (redeemParsed <= currentBalance) {
                if (zoopBankAccountId) {
                    try {
                        // Criando transferência
                        await post(
                            `${process.env.PAY_URL}transfer-create?bank_account_id=${zoopBankAccountId}`,
                            {
                                amount: `${redeemBalance}.0000`
                            }, {
                            headers: {
                                Authorization: `${process.env.PAY_TOKEN}`,
                            },
                        });
                        setCurrentBalance((currentBalance - redeemParsed).toFixed(2));
                        setRedeemBalance('');
                        resolve('Saque realizado com sucesso');
                    } catch (error) {
                        if (error.customError) throw error;
                        throw { msg: 'Erro ao realizar saque. Fale com seu assessor', customError: true };
                    }
                } else throw { msg: 'É necessário configurar dados bancários no menu anterior', customError: true };
            } else throw { msg: 'Saque não pode ultrapassar o valor do seu saldo', customError: true };
        } catch (error) {
            console.log(error);
            if (error.customError) reject(error);
            else {
                console.log(error);
                if (error.response) console.log(error.response);
                reject(error);
            }
        }
    });
};

export default sendToBackend;
