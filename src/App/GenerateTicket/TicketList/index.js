import React from 'react'
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { Menu } from '../../Menu/index'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'

export default ({ transactions }) => {

    const [, setLocation] = useLocation()

    return (
        <Menu title='Relatórios'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Timeline transactions={transactions} transactionClick={({ transaction }) => setLocation(`/relatorio/${transaction.id}`)}/>
            </motion.div>

        </Menu>
    )
}