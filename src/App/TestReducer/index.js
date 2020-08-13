import React, { useState, useReducer, useEffect } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { spinner } from './styles'
import fetch from './fetch'
import { db } from '../../Firebase/index'

const reducer = (state, action) => {
    const machine = {
        changeToBatata: async () => {
            console.log({...state,...action.payload, cpf:'batata'})
            try {
                await db.collection('suppliers').doc('bYg5rhaI73cSqg3wvglSOmDXH5d2').update({cpf:'batata'}) 
                return {...state, ...action.payload, cpf:'batata'}
            } catch (error) {
                console.log(error)
            }
        },
        changeTo000: async () => {
            console.log({...state,...action.payload, cpf:'000.000.000-00'})
            try {
                await db.collection('suppliers').doc('bYg5rhaI73cSqg3wvglSOmDXH5d2').update({cpf:'000.000.000-00'})
                return {...state, ...action.payload, cpf:'000.000.000-00'}
            } catch (error) {
                console.log(error)
            }
        },
        changeToSP: async () => {
            console.log({...state,...action.payload, estado:'SP'})
            try {
                await db.collection('suppliers').doc('bYg5rhaI73cSqg3wvglSOmDXH5d2').update({estado:'SP'})
                return {...state, estado:'SP'}
            } catch (error) {
                console.log(error)
            }
        },
        changeToRJ: async () => {
            console.log({...state,...action.payload, estado:'RJ'})
            try {
                await db.collection('suppliers').doc('bYg5rhaI73cSqg3wvglSOmDXH5d2').update({estado:'RJ'})
                return {...state, estado:'RJ'}
            } catch (error) {
                console.log(error)
            }
        },
    }
        machine[action.type]()
    }

const TestReducer = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [links, setLinks] = useState({})
    const state = {setIsError, setIsLoading, setLinks}
    useEffect(() => fetch(state), [])
    const [linksObj, dispatch] = useReducer(reducer, {})
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );
    if (isError) return <Error />
    return (
        <div style={{width:'90%', maxWidth:'500px', margin:'0 auto'}}>
            <div style={{marginBottom:'40px'}}>
                <h2 style={titleStyle}>Custom Hook Support</h2>
                <div style={line}/>
            </div>
            <div>
                <h2 style={subTitleStyle}>updateFirebase</h2>
                <button type="submit" style={btnStyle} onClick={() => dispatch({type:'updateFirebase', payload:{doc:links.id,update:{status:'Aguardando Teste'}}})}>Update Firebase</button>
            </div>
        <div>
                <h2 style={subTitleStyle}>sendMsg</h2>
                <button type="submit" style={btnStyle} onClick={() => dispatch({type:'sendWhats', payload:{celular:11995643901,msg:'Olá Ahmad'}})}>Send Whats</button>
            </div>
            <div>
                <h2 style={subTitleStyle}>manualApproved</h2>
                <button type="submit" style={btnStyle} onClick={() => dispatch({type:'manualApproved', payload:{docCatalog:'6WyC6q1Xj6Yijg1YtAHg',docCard:'wbsTBsXvKBY4rIW006sJ', update:{status:'approved'}}})}>Send Whats</button>
            </div>
        </div>
    );
}

export default TestReducer
