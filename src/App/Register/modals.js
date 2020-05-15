import React, { useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import { modalContainer, modalLabel, modalBox } from './styles';

export const docText = () => {
    const [modalDoc, setModalDoc] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal boxStyle={modalBox} isOpen={modalDoc} setIsOpen={() => setModalDoc(false)}>
                <label style={modalLabel}>RG ou CNH (Frente e Verso)</label>
                <img
                    src="https://res.cloudinary.com/ziro/image/upload/v1589474596/cnh_vczghs.jpg"
                    alt="Documento com foto"
                    style={{ paddingTop: '10px', width: '100%', height: '100%', alignContent: 'center' }}
                />
            </Modal>
            <label style={modalLabel}>RG ou CNH (Frente e Verso)&nbsp;<Icon type="help" size={16} color='#F7BA00' onClick={() => setModalDoc(true)} /></label>
        </div>
    );
}

export const atvdText = () => {
    const [modalAtvd, setModalAtvd] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal boxStyle={modalBox} isOpen={modalAtvd} setIsOpen={() => setModalAtvd(false)}>
                <label style={modalLabel}>Nota fiscal de compra de produtos</label>
            </Modal>
            <label style={modalLabel}>Nota fiscal de compra de produtos&nbsp;<Icon type="help" size={16} color='#F7BA00' onClick={() => setModalAtvd(true)} /></label>
        </div>
    );
}

export const cnpjText = () => {
    const [modalCNPJ, setModalCNPJ] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal boxStyle={modalBox} isOpen={modalCNPJ} setIsOpen={() => setModalCNPJ(false)}>
                <label style={modalLabel}>Cartão CNPJ</label>
                <img
                    src="https://res.cloudinary.com/ziro/image/upload/v1589474596/cartao_nn6ium.png"
                    alt="Cartão CNPJ"
                    style={{ paddingTop: '10px', width: '100%', height: '100%', alignContent: 'center' }}
                />
            </Modal>
            <label style={modalLabel}>Cartão CNPJ&nbsp;<Icon type="help" size={16} color='#F7BA00' onClick={() => setModalCNPJ(true)} /></label>
        </div>
    );

}

export const homeText = () =>
    <div style={modalContainer}>
        <label style={modalLabel}>Comprovante de Residência</label>
    </div>