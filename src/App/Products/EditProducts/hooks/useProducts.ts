import { useContext, useEffect, useState } from 'react'
import { useMessage } from '@bit/vitorbarbosa19.ziro.message-modal'
import {fetch} from '../utils/fetch'
import { userContext } from '../../../appContext'

export const useProducts = (brandName) => {
  const [productsData, setProductsData] = useState([])
  const [card, setCard] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState(false)
  const setMessage = useMessage()

  useEffect(() => {
    if(productsData.length === 0) fetch(brandName,setLoading, setError, setMessage, setProductsData)
    //fetchZoop(setLoading, setError, setMessage, cardId, setCard)
  }, [])
  /* useEffect(() => {
    fetchZoop(setLoading, setError, setMessage, cardId, setCard)
  }, [cardId])
  const modifyCardId = cardId => {
    setCardId(cardId)
  }
  const removeRow = (idDocument) => {
    setDataRows(dataRows.filter(function (el) {
      return el.id !== idDocument
    }))
  } */

  return {
    productsData,
    //removeRow,
    isLoading,
    isError,
    //modifyCardId,
    card,
  }
}
