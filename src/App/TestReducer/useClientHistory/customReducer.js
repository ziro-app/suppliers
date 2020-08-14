import sendWhats from './functions/sendWhats'
import updateFirebase from './functions/updateFirebase'
import manualApproved from './functions/manualApproved'
import createPayment from './functions/createPayment'

const customReducer = (state, action) => {
    const machine = {
        receivedLink:{
            updateFirebase: () => updateFirebase(state, action),
            sendWhats: () => sendWhats(state,action),
        },
        register:{
            updateFirebase: () => updateFirebase(state, action),
            sendWhats: () => sendWhats(state,action),
        },
        registeredCard: {
            updateFirebase: () => updateFirebase(state, action),
            manualApproved: () => manualApproved(state, action),
            createPayment: () => createPayment(state, action)
        }
    }
        machine[action.status][action.type]()
}

export default customReducer