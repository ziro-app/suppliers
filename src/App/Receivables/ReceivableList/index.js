import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { Menu } from '../../Menu/index';

export default ({ receivables, btnMoreClick, hasMore, loadingMore }) => {

    const [, setLocation] = useLocation()

    return (
        <Menu title='Recebíveis'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Timeline
                    transactions={receivables}
                    transactionClick={({ transaction }) => setLocation(`/recebiveis/${transaction.id}`)}
                    btnMoreClick={btnMoreClick}
                    hasMore={hasMore}
                    isSearching={loadingMore}
                />
            </motion.div>
        </Menu>
    )
}
