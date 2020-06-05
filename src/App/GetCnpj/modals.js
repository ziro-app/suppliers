import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { btn, modalLabel, modalBox } from './styles';

export const CnpjTextOne = () => {
    const [modalHolder, setModalHolder] = useState(true);

    return (
        <div>
            <Modal boxStyle={modalBox} isOpen={modalHolder} setIsOpen={() => setModalHolder(false)}>
                <div style={{ justifySelf: 'center' }} ><Illustration type="waiting" size={200} /></div>
                <label style={modalLabel}>Aguarde. Pode levar alguns minutos. Não saia da página</label>
                <motion.a
                    style={btn}
                    exit={{}}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModalHolder(false)}
                >Ok</motion.a>
            </Modal>
            <label style={{ ...modalLabel, justifyContent: 'start' }}>CNPJ&nbsp;<Icon type="help" size={16} color='#F7BA00' onClick={() => setModalHolder(true)} /></label>
        </div>
    );

}

export const CnpjTextTwo = () => {
    const [modalHolder, setModalHolder] = useState(true);

    return (
        <div>
            <Modal boxStyle={modalBox} isOpen={modalHolder} setIsOpen={() => setModalHolder(false)}>
                <div style={{ justifySelf: 'center' }} ><Illustration type="waiting" size={200} /></div>
                <label style={modalLabel}>A validação é demorada, aguarde sem sair da página</label>
                <motion.a
                    style={btn}
                    exit={{}}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModalHolder(false)}
                >Ok</motion.a>
            </Modal>
            <label style={{ ...modalLabel, justifyContent: 'start' }}>CNPJ&nbsp;<Icon type="help" size={16} color='#F7BA00' onClick={() => setModalHolder(true)} /></label>
        </div>
    );

}