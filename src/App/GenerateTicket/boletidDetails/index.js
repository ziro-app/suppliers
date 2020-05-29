import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import Header from '@bit/vitorbarbosa19.ziro.header';
import {containerWithPadding } from '@ziro/theme';
import Details from '@bit/vitorbarbosa19.ziro.details';

export default ({boletbankId,boletId,data}) => {
    const filtrado = data.values.filter(item => {
        if(item.boleto){
            return String(item.boleto) === boletId
        }else{
            return String(item.boletId) === boletId
        }
    })
    const [blocks, setBlocks] = useState([]);
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
                        content: valor
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
                        content: comissao
                    },
                    {
                        title: 'Receita',
                        content: receita
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
                <Header type='icon-link' title='Detalhe do Boleto' navigateTo={`relatorio/${boletbankId}`} icon='back' />
                <div style={{ display: 'grid', gridRowGap: '12px' }}>
                    <Details blocks={blocks} />
                </div>
            </motion.div>
    )
}