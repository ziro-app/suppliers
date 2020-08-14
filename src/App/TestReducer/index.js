import React, { useState, useReducer, useEffect } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { spinner, btnStyle, titleStyle, subTitleStyle, line } from './styles'
import useClientHistory from './useClientHistory'
import fetch from './fetch'

const TestReducer = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [links, setLinks] = useState({})
    const state = {setIsError, setIsLoading, setLinks}
    useEffect(() => fetch(state), [])
    const [linksObj, dispatch] = useClientHistory()
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );
    if (isError) return <Error />
    const {status} = links.data
    return (
        <div style={{width:'90%', maxWidth:'500px', margin:'0 auto'}}>
            <div style={{marginBottom:'40px'}}>
                <h2 style={titleStyle}>Custom Hook Support</h2>
                <div style={line}/>
            </div>
            <h2>Status: {links.data.status}</h2>
            <div>
                <h2 style={subTitleStyle}>Link Recebido</h2>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'sendWhats', payload:{celular:11995643901,msg:'Olá Ahmad'}})}>Send Whats</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'Cancelado'}}})}>Cancelar Link</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'register'}}})}>Change to Register</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'registeredCard'}}})}>Change to RegisteredCard</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'payed'}}})}>Change to Payed</button>
            </div>
            <div>
                <h2 style={subTitleStyle}>Cadastro Feito</h2>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'sendWhats', payload:{celular:11995643901,msg:'Olá Ahmad'}})}>Send Whats</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'Cancelado'}}})}>Cancelar Link</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'payed'}}})}>Change to Payed</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'registeredCard'}}})}>Change to RegisteredCard</button>
            </div>
            <div>
                <h2 style={subTitleStyle}>Cartão Cadastrado</h2>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'sendWhats', payload:{celular:11995643901,msg:'Olá Ahmad'}})}>Send Whats</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'manualApproved', payload:{docCatalog:'6WyC6q1Xj6Yijg1YtAHg',docCard:'wbsTBsXvKBY4rIW006sJ', update:{status:'approved'}}})}>Manual Approved</button>
                <button type="submit" style={btnStyle} onClick={() => dispatch({status, type:'updateFirebase', payload:{doc:links.id,update:{status:'payed'}}})}>Change to Payed</button>
            </div>
        </div>
    );
}

export default TestReducer
