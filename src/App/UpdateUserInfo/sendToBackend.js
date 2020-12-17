import axios, { post } from 'axios'
import arrayToObject from '@ziro/array-object';

import dataPostBatch from './GetCnpj/utils/dataPostBatch';
import getSheet from './GetCnpj/utils/getSheet';
import postSheet from './GetCnpj/utils/postSheet';
import { db } from '../../Firebase'

const sendToBackend = (backendParams, zoopParams) => () => {
  
  const {
    newPhone,
    cnpj,
    newCpf,
    newLName,
    newFName,
    newBirthdate,
    newWhatsApp,
    zoopId,
    setError,
    setIsLoading,
    typeRegister
  } = backendParams

  return new Promise(async (resolve, reject) => {
    setIsLoading(true)
    try {
      // updateSheets

      const objSheet = {
        fone: newPhone ? `55 ${newPhone}` : '',
        nome: newFName && newLName ? `${newFName} ${newLName}` : '',
        cpf: newCpf || '',
        nascimento: newBirthdate || '',
        whatsapp: newWhatsApp ? `55 ${newWhatsApp}` : ''
      }

      const objSheetSimplified = {
        fone: newPhone ? `55 ${newPhone}` : '',
        nome: newFName && newLName ? `${newFName} ${newLName}` : '',
        whatsapp: newWhatsApp ? `55 ${newWhatsApp}` : ''
      }

      const requestSheet = await axios(getSheet(['Base!A:U']))
      const dataSheet = arrayToObject(requestSheet.data.valueRanges[0])
      const objectPost = dataPostBatch(dataSheet, 'cnpj', cnpj, typeRegister === 'Completo' ? objSheet : objSheetSimplified, 'Base')
      await axios(postSheet(objectPost))

      
      // Updates Firestore
      const objFirebase = {
        telefone: newPhone ? `55 ${newPhone}` : '',
        nome: newFName || '',
        sobrenome: newLName || '',
        cpf: newCpf || '',
        nascimento: newBirthdate || '',
        whatsapp: newWhatsApp ? `55 ${newWhatsApp}` : ''
      }
      try {
        const snapCollection = await db.collection('suppliers').where('cnpj', '==', cnpj).get()
        let docId
        snapCollection.forEach(doc => docId = doc.id)
        await db.collection('suppliers').doc(docId).update(objFirebase)
      } catch (error) {
        console.log(error)
        if (error.response) console.log(error.response)
        throw 'Erro ao salvar na Firestore'
      }

      // Updates Zoop Owner Info
      try {
        await post(
        `${process.env.PAY_URL}sellers-update?seller_id=${zoopId}`,
          {
            owner: {
              first_name: newFName || undefined,
              last_name: newLName || undefined,
              taxpayer_id: newCpf || undefined,
              birthdate: newBirthdate ? newBirthdate.split('/').reverse().join('-') : undefined,
              phone_number: newPhone ? `55 ${newPhone}` : ''
            },
          },
          {
            headers: {
              Authorization: `${process.env.PAY_TOKEN}`,
            },
          }
        );

        // Update Zoop Seller Info
        try{
          const { newReason, street, number, complement, newNeighborhood, newCity, newCityState, newCep } = zoopParams;
          
          await post(
            `${process.env.PAY_URL}sellers-update?seller_id=${zoopId}`,
              {
                business_name: newReason || undefined,
                business_address: {
                  line1: street || undefined,
                  line2: number || undefined,
                  line3: complement || '',
                  neighborhood: newNeighborhood || undefined,
                  city: newCity || undefined,
                  state: newCityState || undefined,
                  postal_code: newCep || undefined
                },
              },
              {
                headers: {
                  Authorization: `${process.env.PAY_TOKEN}`,
                },
              }
          );
        }catch(error){
          console.log(error);
        };
      }catch(error) {
        if (error.customError) {
          setError(error)
          reject(error)
        }
        else {
          console.log(error)
          if (error.response) console.log(error.response)
          reject(error)
        }
      }
    resolve('Deu bom!')
    } catch (error) {
      if (error.customError) {
        setError(error)
        reject(error)
      }
      else {
        console.log(error)
        if (error.response) console.log(error.response)
        reject(error)
      }
    } finally {
      setIsLoading(false)
    }
  })
}

export default sendToBackend