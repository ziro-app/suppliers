import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { Menu } from '../../Menu/index';

export default ({ transactions, btnMoreClick, hasMore, loadingMore, setTransaction }) => {
  const [, setLocation] = useLocation();

  return (
    <Menu title="Vendas">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Timeline
          transactions={transactions}
          transactionClick={({ transaction }) => {
            setTransaction({});
            setLocation(`/transacoes/${transaction.transactionId}`);
          }}
          btnMoreClick={btnMoreClick}
          hasMore={hasMore}
          isSearching={loadingMore}
        />
      </motion.div>
    </Menu>
  );
};
