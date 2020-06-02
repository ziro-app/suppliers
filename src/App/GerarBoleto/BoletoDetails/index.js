import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import Header from '@bit/vitorbarbosa19.ziro.header';
import {containerWithPadding } from '@ziro/theme';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import currencyFormat from '@ziro/currency-format';
import Button from '@bit/vitorbarbosa19.ziro.button';
import NotFound from './NotFound/index'
import { modalContainer } from './styles'

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
    const [linkImage, setLinkImage] = useState('')
    useEffect(() => {
        const stringToNumber = (numero) => {
            if(typeof numero === 'number'){
                return Number(numero)*100
            }else{
                return Number((numero.replace('.','')).replace(',','.'))*100
            }
        }
        const {comissao, lojista, polo, receita, romaneio, rua, valor, vencimento, venda,boleto,boletId,data_venda,url} = filtrado[0]
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
                        title: 'Romaneio',
                        content: romaneio === '' ? '-' : romaneio
                    },
                    {
                        title: 'Lojista',
                        content: lojista
                    },
                    {
                        title: 'Venda',
                        content: venda || data_venda
                    },
                    {
                        title: 'Vencimento',
                        content: vencimento
                    },
                    {
                        title: 'Valor',
                        content: currencyFormat(stringToNumber(valor))
                    },
                    {
                        title: 'Comissão',
                        content: `${(stringToNumber(comissao)).toLocaleString()}%`
                    },
                    {
                        title: 'Receita',
                        content: `R$${(stringToNumber(receita)/100).toLocaleString(undefined,{minimumFractionDigits: 2,maximumFractionDigits: 2})}`
                    }
                ]
            }
        ]
        setBlocks(block)
        setLinkImage(url)
    }, [])
    const textAreaRef = useRef(null);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
                <input type="text" style={{ position: 'absolute', left: '-9999px' }} ref={textAreaRef} readOnly />
                <Header type='icon-link' title={`Boleto ${boletId || boleto}`} navigateTo={`relatorio/${boletbankId}`} icon='back' />
                <div style={{ display: 'grid', gridRowGap: '12px'}}>
                    <Details blocks={blocks} />
                    <Modal boxStyle={modalContainer} isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
                    {linkImage
                        ? <img style={{display: 'block', width:'100%'}} src={linkImage} alt={'Imagem do Boleto'}/>
                        : <NotFound />
                    }
                    </Modal>
                     <div style={{ display: 'grid', marginTop:'15px' }} onClick={() => setIsOpen(true)}>
                    <Button type="submit" cta="Imagem do boleto" />
                </div>
                </div>
            </motion.div>
    )
}