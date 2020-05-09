import React, { useEffect, useState, useMemo } from 'react'
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { Menu } from '../../Menu/index'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'

export default ({ transactions }) => {

    const [, setLocation] = useLocation()

    return (
        <Menu title='Vendas'>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Timeline transactions={transactions} onClick={({ transaction }) => setLocation(`/transacoes/${transaction.transactionId}`)} />
            </motion.div>

        </Menu>
    )
}