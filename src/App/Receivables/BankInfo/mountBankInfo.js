import banksList from '../../Register/banks';

const mountBankInfo = (setIsLoading, setBlocks, { codBank, holderName, accountType, accountNumber, agency }) => {
    let bank = banksList.find(bank => bank.split(' - ')[0] == codBank);
    let bankName = bank ? bank.split(' - ')[1] : '';
    setBlocks(
        [
            {
                header: 'Conta Atual',
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
}

export default mountBankInfo;
