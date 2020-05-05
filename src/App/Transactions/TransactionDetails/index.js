import React from 'react';
import { motion } from 'framer-motion';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Button from '@bit/vitorbarbosa19.ziro.button';
import { successColor } from '@ziro/theme';

const blocks = [
    {
        header: 'Compra',
        body: [
            {
                title: 'Marca',
                content: 'Crisfael'
            },
            {
                title: 'Valor',
                content: 'R$3.000,33'
            },
            {
                title: 'Forma',
                content: 'crédito 3x'
            },
            {
                title: 'Data',
                content: '23/02/20'
            },
            {
                title: 'Status',
                content: 'Aprovada',
                color: successColor
            },
        ]
    }
]

const data = [
    {
        title: 'Lançamentos Pagos',
        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
        rows: [
            ['1', '1.000,11', '950,00', '23/03'],
            ['2', '1.000,11', '950,00', '23/04']
        ],
        totals: ['-', '2.000,22', '1.900,00', '-']
    },
    {
        title: 'Lançamentos Futuros',
        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
        rows: [
            ['3', '1.000,11', '950,00', '23/05']
        ],
        totals: ['-', '1.000,11', '950,00', '-']
    }
]

const TransactionDetails = ({ onclick }) => {

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridRowGap: '15px' }}>
            <Details blocks={blocks} />
            <Table data={data} customGrid={{
                gridTemplateColumns: 'auto 1fr 1fr 1fr',
                gridRowGap: '15px'
            }} />
            <Button
                type="button"
                cta="Voltar"
                template="regular"
                click={onclick}
            />
        </motion.div>
    );
}

export default TransactionDetails