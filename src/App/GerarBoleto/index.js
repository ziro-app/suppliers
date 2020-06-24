import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import { spinner } from './styles';
import Error from '@bit/vitorbarbosa19.ziro.error'
import { userContext } from '../appContext'
import DuplicataDetails from './DuplicataDetails/index'
import RelatorioList from './RelatorioList/index'
import fetch from './fetch'

const GerarBoleto = ({ boletbankId, boletId }) => {
    const { zoopId, docId, razao, email, fantasy } = useContext(userContext)
    const [firstTicket, setfisrtTicket] = useState([]);
    const [ticket, setTicket] = useState([]);
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [charge, setCharge] = useState('')
    const [url, setUrl] = useState('')
    const [urlLoad, setUrlLoad] = useState(false)
    const [maxInstallments, setMaxInstallments] = useState('')
    const state = { seller: fantasy, sellerId: zoopId, razao, charge, maxInstallments, docId, url, urlLoad, email, setCharge, setMaxInstallments, setIsError, setIsLoading, setUrl, setUrlLoad, setfisrtTicket, setTicket }
    useEffect(() => fetch(state), []);
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );
    if (isError) return <Error />
    if (boletbankId && boletId) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DuplicataDetails transactions={firstTicket} boletbankId={boletbankId} boletId={boletId} sellerId={state.sellerId} /></motion.div>
    if (boletbankId) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DuplicataDetails transactions={firstTicket} boletbankId={boletbankId} boletId={''} sellerId={state.sellerId} /></motion.div>;
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><RelatorioList transactions={ticket} /></motion.div>;
}

export default GerarBoleto
