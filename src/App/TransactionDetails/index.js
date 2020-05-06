import React from 'react';
import { motion } from 'framer-motion';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { custom, illustrationContainer } from './styles';

const TransactionDetails = ({ status, data, blocks, onclick }) => {

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridRowGap: '20px' }}>
            <Details blocks={blocks} />
            {
                status === 'Aprovada' &&
                <>
                    <Table data={data} customGrid={{
                        gridTemplateColumns: 'auto 1fr 1fr 1fr',
                        gridRowGap: '15px'
                    }} />
                    <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Os valores das parcelas foram arredondados para a segunda casa decimal</span>
                </>
            }
            {
                status === 'Cancelado' &&
                <div style={illustrationContainer}>
                    <div style={{ display: 'grid', justifyItems: 'center' }}>
                        <Illustration type="paymentError" size={150} />
                        <span style={custom(15, '#bb2124')}>Pagamento cancelado.</span>
                    </div>
                </div>
            }
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