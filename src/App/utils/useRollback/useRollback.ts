import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { fbauth, auth, db } from '../../../Firebase/index';
//import * from './IRollbackData';

const useRollback = () => {
    console.log('teste 0')
  //é como se uma lista fosse montada, ou seja, vamos adicionar itens com suas origens,
  //identificadores e método a ser usado,
  //se houver a necessidade de rollback, iremos caminhar por essa lista realizando as operacoes
  const [dataRollback, setDataRollback] = useState <Array<IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData>>([]); //useState<IRollbackData[]>([]);
  const [startRollbacks, setStartRollbacks] = useState(false);

  const update = () => {
    //auth.signInWithEmailAndPassword(emailRoolback, passRollback).then(() => {
      const run = async () => {
          console.log('entrou')
          console.log('startRollbacks useRollback',startRollbacks)
          console.log('dataRollback useRollback',dataRollback)
        if (dataRollback.length > 0) {
          let snapCollection;
          let docRefCollection;
          Object.entries(dataRollback).map(async item => {
              console.log('items useRollback',item)
            const { origin } = item[1] as unknown as IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData;
            console.log('origin useRollback',origin)
            if (origin === 'firebase') {
              const { collection, field, identifier } = item[1] as unknown as IFirebaseData;
              console.log('firebase');
              snapCollection = await db.collection(collection).where(field, '==', identifier).get();
              snapCollection.forEach(doc => (docRefCollection = doc.ref));
              docRefCollection.delete();
            } else if (origin === 'sheets') {
              console.log('sheets');
              const { range, spreadsheetId, values } = item[1] as unknown as ISheetsData;
              console.log('range',range);
              console.log('spreadsheetId',spreadsheetId);
              console.log('values',values);
              const url = process.env.SHEET_URL;
              const config = {
                headers: {
                  'Content-type': 'application/json',
                  Authorization: process.env.SHEET_TOKEN,
                },
              };
              const body = {
                apiResource: 'values',
                apiMethod: 'update',
                range: range,
                spreadsheetId,
                resource: {
                  values: [values],
                },
                valueInputOption: 'raw',
              };
              await axios.post(url, body, config);
            } else if (origin === 'zoop') {
              console.log('zoop');
              const { zoopId } = item[1] as unknown as IZoopData;;
              console.log('api');
              await axios.post(
                `${process.env.PAY_URL}sellers-delete?seller_id=${zoopId}`,
                {},
                {
                  headers: {
                    Authorization: `${process.env.PAY_TOKEN}`,
                  },
                },
              );
            } else if (origin === 'auth'){
              const {pass} = item[1] as unknown as IUserData;
              const user = auth.currentUser;
              console.log('user',user)
              console.log('pass',pass)
              const credential = fbauth.EmailAuthProvider.credential(user.email, pass)
              await user.reauthenticateWithCredential(credential)
              await user.delete()
              //window.location.replace('/')
              await auth.signOut()
            } /*else {
              const { url, body, config } = item as unknown as IApiData;
              console.log('api');
              await axios.post(url, body, config);
            }*/
          });
          setDataRollback([]);
          setStartRollbacks(false);
        }
      };
      run();
    //});
  };
  /*useEffect(() => {
    (async () => {

    })();
  }, [startRollbacks]);*/

  const createRollbackItem = (object: IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData) => {
      const {origin} = object
      if(origin === 'firebase'){
        const { collection, field, identifier} = object as IFirebaseData
        const newZoopId:IFirebaseData = {origin,collection, field, identifier}
        addRollbackItem(newZoopId)
      }
      if(origin === 'sheets'){
        const { range, spreadsheetId, values } = object as ISheetsData
        const newZoopId:ISheetsData = {origin,range, spreadsheetId, values}
        addRollbackItem(newZoopId)
      }
      if(origin === 'zoop'){
        const { zoopId } = object as IZoopData
        const newZoopId:IZoopData = {origin,zoopId}
        addRollbackItem(newZoopId)
      }
      if(origin === 'auth'){
        const { pass} = object as IUserData
        const newZoopId:IUserData = {origin,pass}
        addRollbackItem(newZoopId)
      }
  }

  const addRollbackItem = (rollbackData: IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData) => {
    console.log('teste 2')
    console.log('dataRollback 2',dataRollback)
    const array:Array<IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData> = dataRollback
    array.push(rollbackData)
    console.log('dataRollback 3',dataRollback)
    //setDataRollback(array)
    //setDataRollback(prevState => [...prevState, rollbackData]);
  };

  const startRollback = () => {
    console.log('teste 3')
    console.log('dataRollback items:', dataRollback)
    setStartRollbacks(true);
    update()
  };
  const cleanRollback = () =>{
      setDataRollback([])
  }
  return {
    dataRollback,
    startRollback,
    createRollbackItem,
    cleanRollback
  };
}

export default useRollback;
