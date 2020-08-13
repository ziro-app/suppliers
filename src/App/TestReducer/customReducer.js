import { db } from '../../Firebase/index'
import sendWhats from './utils/sendWhats'

const reducer = (state, action) => {
    const machine = {
        updateFirebase: async () => {
            const {doc, update} = action.payload
            try {
                await db.collection('credit-card-payments-test').doc(doc).update(update) 
                return {...state, ...update}
            } catch (error) {
                console.log(error)
            }
        },
