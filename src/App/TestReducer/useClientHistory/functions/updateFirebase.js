import {db} from '../../../../Firebase'

const updateFirebase = async (state, action) => {
    const {doc, update} = action.payload
    try {
        await db.collection('credit-card-payments-test').doc(doc).update(update) 
        return {...state, ...update}
    } catch (error) {
        console.log(error)
    }  
}

export default updateFirebase