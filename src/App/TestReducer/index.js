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
    const [supplier, setSupplier] = useState({})
    const state = {setIsError, setIsLoading, setSupplier}
    useEffect(() => fetch(state), [])
    const [supplierObj, dispatch] = useReducer(reducer, {})
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );
    if (isError) return <Error />
    return (
        <div>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <h2>cpf: {supplier.cpf || supplierObj.cpf}</h2>
                <button type='submit' onClick={() => dispatch({type: 'changeToBatata', payload:supplier})}>Change to batata</button>
                <button type='submit' onClick={() => dispatch({type: 'changeTo000', payload:supplier})}>Change to 000.000.000-00</button>
            </div>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <h2>estado: {supplier.estado}</h2>
                <button type='submit'  onClick={() => dispatch({type: 'changeToRJ'})}>Change to RJ</button>
                <button type='submit'  onClick={() => dispatch({type: 'changeToSP'})}>Change to SP</button>
            </div>
        </div>
    );
}

export default TestReducer
