import React, { useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import { modalContainer, modalLabel, modalBox } from './styles';

export const DocText = () => {
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
            <label style={modalLabel}>RG ou CNH (Frente e Verso)&nbsp;<Icon type="help" size={16} color='#2d9cdb' onClick={() => setModalDoc(true)} /></label>
        </div>
    );
}

export const AtvdText = () => {
    const [modalAtvd, setModalAtvd] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal boxStyle={modalBox} isOpen={modalAtvd} setIsOpen={() => setModalAtvd(false)}>
                <label style={modalLabel}>Nota fiscal de compra de produtos</label>
                <img
                    src="https://res.cloudinary.com/ziro/image/upload/v1589552592/nota_abs6jw.jpg"
                    alt="Nota Fiscal"
                    style={{ paddingTop: '10px', width: '100%', height: '100%', alignContent: 'center' }}
                />
            </Modal>
            <label style={modalLabel}>Nota fiscal de compra de produtos&nbsp;<Icon type="help" size={16} color='#2d9cdb' onClick={() => setModalAtvd(true)} /></label>
        </div>
    );
}

export const CnpjText = () => {
    const [modalCNPJ, setModalCNPJ] = useState(false);

    return (
        <div style={modalContainer}>
            <Modal boxStyle={modalBox} isOpen={modalCNPJ} setIsOpen={() => setModalCNPJ(false)}>
                <label style={modalLabel}>Cartão CNPJ</label>
                <img
                    src="https://res.cloudinary.com/ziro/image/upload/v1589510718/cartao_w7gh3k.png"
                    alt="Cartão CNPJ"
                    style={{ paddingTop: '10px', width: '100%', height: '100%', alignContent: 'center' }}
                />
            </Modal>
            <label style={modalLabel}>Cartão CNPJ&nbsp;<Icon type="help" size={16} color='#2d9cdb' onClick={() => setModalCNPJ(true)} /></label>
        </div>
    );

}

export const HomeText = () =>
    <div style={modalContainer}>
        <label style={modalLabel}>Comprovante de endereço da empresa</label>
    </div>

export const HolderText = () => {
    const [modalHolder, setModalHolder] = useState(false);

    return (
        <div>
            <Modal boxStyle={modalBox} isOpen={modalHolder} setIsOpen={() => setModalHolder(false)}>
                <label style={modalLabel}>Conta precisa estar no nome da empresa</label>
            </Modal>
            <label style={{ ...modalLabel, justifyContent: 'start' }}>Titular&nbsp;<Icon type="help" size={16} color='#2d9cdb' onClick={() => setModalHolder(true)} /></label>
        </div>
    );

}