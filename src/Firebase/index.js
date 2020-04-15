import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { firebaseConfig } from './firebase-config.js'

const init = firebase.initializeApp(firebaseConfig)

export const
db = init.firestore(),
auth = init.auth(),
fs = firebase.firestore,
fbauth = firebase.auth,
storage = firebase.storage().ref