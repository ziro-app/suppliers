import React from 'react';
import Lottie from 'react-lottie';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import { containerWithPadding, warningColor } from '@ziro/theme';
import WebProgramming from '../../animations/webprogramming.json';

const ReceivableDetails = ({ transactions, transactionId, receivableId }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: WebProgramming,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const custom = (fontSize, color) => ({
        display: 'grid',
        justifyItems: 'center',
        fontSize: `${(fontSize + 2) / 10}rem`,
        fontWeight: '500',
        color: color
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type='icon-link' title='Detalhes do lançamento' navigateTo={`transacoes/${transactionId}`} icon='back' />
            <span style={custom(16, warningColor)}>Aguarde. Em desenvolvimento</span>
            <Lottie
                options={defaultOptions}
                height={250}
                width={250}
                speed={2}
                isPaused={false}
                isStopped={false}
                isClickToPauseDisabled
            />
        </motion.div>
    );
}

export default ReceivableDetails