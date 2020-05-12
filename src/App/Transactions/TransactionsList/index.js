import React from 'react'
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { Menu } from '../../Menu/index'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'

export default ({ transactions, btnMoreClick, hasMore, loadingMore }) => {

    const [, setLocation] = useLocation()

    return (
        <Menu title='Vendas'>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Timeline transactions={transactions} transactionClick={({ transaction }) => setLocation(`/transacoes/${transaction.transactionId}`)} btnMoreClick={btnMoreClick} hasMore={hasMore} isSearching={loadingMore} />
            </motion.div>

        </Menu>
    )
}