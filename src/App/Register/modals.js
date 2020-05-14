import React, { useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import { modalContainer, modalLabel } from './styles';

export const docText = () => {
    const [modalDoc, setModalDoc] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal isOpen={modalDoc} setIsOpen={() => setModalDoc(false)}>
                <label style={modalLabel}>
                    É necessário o envio de um documento de identificação com foto, como no exemplo a seguir
                    </label>
                <img
                    src="https://res.cloudinary.com/ziro/image/upload/v1589474596/cnh_vczghs.jpg"
                    alt="Documento com foto"
                    style={{ paddingTop: '20px', width: '100%', height: '100%', alignContent: 'center' }}
                />
            </Modal>
            <label style={modalLabel}>Identificação (RG, CNH) - Frente e Verso <Icon type="help" size={18} color='#F7BA00' onClick={() => setModalDoc(true)} /></label>
        </div>
    );
}

export const atvdText = () => {
    const [modalAtvd, setModalAtvd] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal isOpen={modalAtvd} setIsOpen={() => setModalAtvd(false)}>
                <label style={modalLabel}>
                    Nos envie uma nota fiscal de produtos que você comprou para vender na sua loja
                    </label>
            </Modal>
            <label style={modalLabel}>Atividade (Nota fiscal de compra de produtos) <Icon type="help" size={18} color='#F7BA00' onClick={() => setModalAtvd(true)} /></label>
        </div>
    );
}

export const cnpjText = () => {
    const [modalCNPJ, setModalCNPJ] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal isOpen={modalCNPJ} setIsOpen={() => setModalCNPJ(false)}>
                <label style={modalLabel}>
                    Nos envie o cartão CNPJ de sua empresa, como no exemplo a seguir
                    </label>
                <img
                    src="https://res.cloudinary.com/ziro/image/upload/v1589474596/cartao_nn6ium.png"
                    alt="Cartão CNPJ"
                    style={{ paddingTop: '20px', width: '100%', height: '100%', alignContent: 'center' }}
                />
            </Modal>
            <label style={modalLabel}>Cartão CNPJ <Icon type="help" size={18} color='#F7BA00' onClick={() => setModalCNPJ(true)} /></label>
        </div>
    );

}

export const homeText = () =>
    <div style={modalContainer}>
        <label style={modalLabel}>Comprovante de Residência (Ex: Conta de luz)</label>
    </div>