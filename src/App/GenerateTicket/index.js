import React, { useState, useContext, useEffect } from 'react'
// import capitalize from '@ziro/capitalize'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import { spinner } from './styles';
import Error from '@bit/vitorbarbosa19.ziro.error'
// import Timeline from '@bit/vitorbarbosa19.ziro.timeline'
// import { motion } from 'framer-motion'
import { userContext } from '../appContext'
import TicketDetails from './TicketDetails/index'
// import sendToBackend from './sendToBackend'
// import sendToEmail from './sendToEmail'
import TicketList from './TicketList/index'
import fetch from './fetch'

const GerarBoleto = ({ boletbankId, boletId }) => {
    const { fname, lname, zoopId, docId, razao, email } = useContext(userContext)
    const [firstTicket, setfisrtTicket] = useState([]);
    const [ticket, setTicket] = useState([]);
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [charge, setCharge] = useState('')
    const [url, setUrl] = useState('')
    const [urlLoad, setUrlLoad] = useState(false)
    const [maxInstallments, setMaxInstallments] = useState('')
    const state = { seller: 'A Duqueza', sellerId: '6e4b9db52193481ca2a345dfc3577c8e', razao: 'A Duqueza', charge, maxInstallments, docId,url,urlLoad,email:'ahmad.forhat@gmail.com',setCharge, setMaxInstallments, setIsError, setIsLoading, setUrl,setUrlLoad }
    useEffect(() => fetch(setIsLoading, setIsError, state.razao, setfisrtTicket, setTicket),[]);
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (isError) return <Error />
    if (boletbankId && boletId) return <TicketDetails transactions={firstTicket} boletbankId={boletbankId} boletId={boletId} sellerId={state.sellerId}/>
    if (boletbankId) return <TicketDetails transactions={firstTicket} boletbankId={boletbankId} boletId={''} sellerId={state.sellerId}/>;
    return <TicketList transactions={ticket}/>;
}

export default GerarBoleto