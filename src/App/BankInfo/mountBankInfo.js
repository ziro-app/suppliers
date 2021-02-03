import React from 'react';
import MessageModal from '@bit/vitorbarbosa19.ziro.message-modal';
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button';
import banksList from '../Register/banks';

const mountBankInfo = (setIsLoading, setBlocks, { codBank, holderName, accountType, accountNumber, agency, activate, asyncClick }) => {
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
                    },
                    {
                        title: 'Recebimento automático',
                        content: <MessageModal><ToggleButton size={30} template="primary" styleContainer={{ display: 'grid', justifyContent: 'end' }} active={activate} onClick={() => asyncClick()} /></MessageModal>
                    }
                ]
            }
        ]
    );
    setIsLoading(false);
}

export default mountBankInfo;
