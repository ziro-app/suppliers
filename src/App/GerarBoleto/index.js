import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { spinner } from './styles'
import { userContext } from '../appContext'
import DuplicataDetails from './DuplicataDetails/index'
import RelatorioList from './RelatorioList/index'
import fetchPayments from './fetchPayments'
import fetchPending from './fetchPending'
import fetchJoin from './fetchJoin'

const GerarBoleto = ({ boletbankId, boletId }) => {
    const { zoopId, docId, razao, email, fantasy } = useContext(userContext)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [charge, setCharge] = useState('')
    const [url, setUrl] = useState('')
    const [urlLoad, setUrlLoad] = useState(false)
    const [installmentsMax, setInstallmentsMax] = useState('')
    const [paymentDuplicatas, setPaymentDuplicatas] = useState([])
    const [paymentBoletos, setPaymentBoletos] = useState([])
    const [pendingBoletos, setPendingBoletos] = useState([])
    const [pendingDuplicatas, setPendingDuplicatas] = useState([])
    const [finishPayments, setFinishPayments] = useState(false)
    const [finishPending, setFinishPending] = useState(false)
    const [ticket, setTicket] = useState([])
    const [firstTicket, setfisrtTicket] = useState([])
    const state = { finishPayments, setFinishPayments, finishPending, setFinishPending, paymentDuplicatas, setPaymentDuplicatas, paymentBoletos, setPaymentBoletos,pendingBoletos, setPendingBoletos,pendingDuplicatas, setPendingDuplicatas, seller:fantasy, sellerId: zoopId, razao, charge, installmentsMax, docId, url, urlLoad, email, setCharge, setInstallmentsMax, setIsError, setIsLoading, setUrl, setUrlLoad, setfisrtTicket, setTicket }
    useEffect(() => fetchPayments(state), [])
    useEffect(() => fetchPending(state), [])
    useEffect(() => fetchJoin(state), [paymentDuplicatas, paymentBoletos, pendingBoletos, pendingDuplicatas])
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );
    if (isError) return <Error />
    if (boletbankId && boletId) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DuplicataDetails transactions={firstTicket} boletbankId={boletbankId} boletId={boletId} sellerId={state.sellerId} /></motion.div>
    if (boletbankId) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DuplicataDetails transactions={firstTicket} boletbankId={boletbankId} boletId="" sellerId={state.sellerId} /></motion.div>;
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><RelatorioList transactions={ticket} /></motion.div>;
}

export default GerarBoleto
