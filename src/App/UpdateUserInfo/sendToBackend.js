import axios, { post } from 'axios'
import arrayToObject from '@ziro/array-object';

import dataPostBatch from './GetCnpj/utils/dataPostBatch';
import getSheet from './GetCnpj/utils/getSheet';
import postSheet from './GetCnpj/utils/postSheet';
import { db } from '../../Firebase'

const sendToBackend = (cnpj, column, row, obj, newProp, setIsLoading, setError, zoopId, newFName, newLName, newCpf, newBirthdate, newPhone, zoopParams) => () => {
  let property
  if (Object.keys(obj)[0] === 'ie') property = `'${newProp}`
  else property = newProp
  const url = process.env.SHEET_URL
  const body = {
    apiResource: 'values',
    apiMethod: 'update',
    range: `Base!${column}${row}`,
    valueInputOption: 'user_entered',
    spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
    resource: {
      values: [[property]]
    }
  }

  const config = {
    headers: {
      'Content-type': 'application/json',
      'Authorization': process.env.SHEET_TOKEN
    }
  }
  return new Promise(async (resolve, reject) => {
    setIsLoading(true)
    try {
      // const requestSheet = await axios(getSheet(['Base!A:U']))
      // const dataSheet = arrayToObject(requestSheet.data.valueRanges[0])
      // const objectPost = dataPostBatch(dataSheet, 'cnpj', cnpj, obj, 'Base')
      // await axios(postSheet(objectPost))
      // console.log('dataSheet:', dataSheet);

      if (row) await post(url, body, config)      
      
      // Updates Firestore
      try {
        const snapCollection = await db.collection('suppliers').where('cnpj', '==', cnpj).get()
        let docId
        snapCollection.forEach(doc => docId = doc.id)
        await db.collection('suppliers').doc(docId).update(obj)
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
              first_name: newFName ? newFName : undefined,
              last_name: newLName ? newLName : undefined,
              taxpayer_id: newCpf ? newCpf : undefined,
              birthdate: newBirthdate ? newBirthdate.split('/').reverse().join('-') : undefined,
              phone_number: newPhone === "" ? newPhone === "" : newPhone ? newPhone : undefined
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
                business_name: newReason ? newReason : undefined,
                business_address: {
                  line1: street || undefined,
                  line2: number || undefined,
                  line3: complement || '',
                  neighborhood: newNeighborhood ? newNeighborhood : undefined,
                  city: newCity ? newCity : undefined,
                  state: newCityState ? newCityState : undefined,
                  postal_code: newCep ? newCep : undefined
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