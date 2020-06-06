import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import currencyFormat from '@ziro/currency-format'
import {containerWithPadding } from '@ziro/theme';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Header from '@bit/vitorbarbosa19.ziro.header'

export default ({ valorTotal, duplicateId }) => {
	const [blocks, setBlocks] = useState([]);
	const [, setLocation] = useLocation();
    useEffect(() => {
        const block = [
            {
                header: 'Dados Bancários',
                body: [
                    {
                        title: 'Banco',
                        content: 'Banco Inter - 077'
                    },
                    {
                        title: 'Agência',
                        content: '0001'
                    },
                    {
                        title: 'Conta Corrente',
                        content: '1065889-0'
                    },
                    {
                        title: 'Favorecido',
                        content: 'Ziro Negócios Digitais'
                    },
                    {
                        title: 'CNPJ',
                        content: '28.026.371/0001-61'
					},
					{
						title:'Valor Total',
						content: currencyFormat(valorTotal)
					}
                ]
            }
		]
		setBlocks(block)
    }, [valorTotal])
    const textAreaRef = useRef(null);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type='icon-link' title='Transferência Bancária' navigateTo={`relatorio/${duplicateId}`} icon='back' />
                <input type="text" style={{ position: 'absolute', left: '-9999px' }} ref={textAreaRef} readOnly />
                <div style={{ display: 'grid', gridRowGap: '12px', marginTop:'20px'}}>
                    <Details blocks={blocks} />
                </div>
            </motion.div>
    )
}