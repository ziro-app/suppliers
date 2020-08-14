import {db} from '../../../../Firebase'

const manualApproved = async (state, action) => {
    const {docCatalog, docCard, update} = action.payload
    try {
        await db.collection('catalog-user-data').doc(docCatalog).collection('cards').doc(docCard).update(update)
        return {...state, ...update}
    } catch (error) {
        console.log(error)
    }
}

export default manualApproved