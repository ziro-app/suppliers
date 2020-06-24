import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import ReceivableList from './ReceivableList/index';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';

const Receivables = ({ receivableId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [receivables, setReceivables] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const { zoopId } = useContext(userContext);

    useEffect(
        () => fetch(setIsLoading, setErrorLoading, receivables, setReceivables, zoopId, limit, offset, setHasMore, setLoadingMore),
        [],
    );

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );

    if (errorLoading) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReceivableList
                receivables={receivables}
                btnMoreClick={() => {
                    setLoadingMore(true);
                    setOffset(offset === 0 ? (offset + 1) + limit : offset + limit);
                    fetch(setIsLoading, setErrorLoading, receivables, setReceivables, zoopId, limit, offset === 0 ? ((offset + 1) + limit) : (offset + limit), setHasMore, setLoadingMore);
                }}
                hasMore={hasMore}
                loadingMore={loadingMore}
            />
        </motion.div>
    );
};

export default Receivables;
