import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import Header from '@bit/vitorbarbosa19.ziro.header';
import {containerWithPadding } from '@ziro/theme';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import currencyFormat from '@ziro/currency-format';
import Button from '@bit/vitorbarbosa19.ziro.button';

export default ({boletbankId,boletId,data}) => {
    const filtrado = data.values.filter(item => {
        if(item.boleto){
            return String(item.boleto) === boletId
        }else{
            return String(item.boletId) === boletId
        }
    })
    const [blocks, setBlocks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const {comissao, fornecedor, lojista, polo, receita, romaneio, rua, valor, vencimento, venda, status,boleto,boletId,data_venda} = filtrado[0]
        let block;
        block = [
            {
                header: 'Informações do boleto',
                body: [
                    {
                        title: 'Boleto',
                        content: boletId || boleto
                    },
                    {
                        title: 'Venda',
                        content: venda || data_venda
                    },
                    {
                        title: 'Lojista',
                        content: lojista
                    },
                    {
                        title: 'Romaneio',
                        content: romaneio === '' ? '-' : romaneio
                    },
                    {
                        title: 'Valor',
                        content: currencyFormat(valor*100)
                    },
                    {
                        title: 'Vencimento',
                        content: vencimento
                    },
                    {
                        title: 'Status',
                        content: status
                    },
                    {
                        title: 'Comissão',
                        content: `${(comissao*100).toLocaleString()}%`
                    },
                    {
                        title: 'Receita',
                        content: currencyFormat(receita*100)
                    }
                ]
            }
        ]
        setBlocks(block)
    }, [])
    const textAreaRef = useRef(null);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
                <input type="text" style={{ position: 'absolute', left: '-9999px' }} ref={textAreaRef} readOnly />
                <Header type='icon-link' title={`Boleto ${boletId || boleto}`} navigateTo={`relatorio/${boletbankId}`} icon='back' />
                <div style={{ display: 'grid', gridRowGap: '12px'}}>
                    <Details blocks={blocks} />
                    <Modal isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
                    <img style={{width:'100%'}} src={'https://lh3.googleusercontent.com/pw/ACtC-3cMGQZtbL-xYirA3kyq_fMVVAyUe0sAI5afZWUWQFg9EJlvFImu_VwCTG-6yfNpay10RcgNPYNZxxkES2Cgz_c_LFqqL5eb5PpP2N5gL2Glr8fX9uxRTT-fRxp3qZrCYUoy0xSNULZ0msOJhWDyUXw=w678-h903-no?authuser=0'} alt={'exemplo'}/>
                    </Modal>
                     <div style={{ display: 'grid', marginTop:'15px' }} onClick={() => setIsOpen(true)}>
                    <Button type="submit" cta="Imagem do boleto" />
                </div>
                </div>
            </motion.div>
    )
}