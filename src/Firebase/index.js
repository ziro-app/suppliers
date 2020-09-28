import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { firebaseConfig } from './firebase-config.js'
import { firebaseHomologConfig } from './firebase-homolog-config'

const config = process.env.HOMOLOG ? firebaseHomologConfig : firebaseConfig;

const init = firebase.initializeApp(config);

export const
    db = init.firestore(),
    auth = init.auth(),
    fs = firebase.firestore,
    fbauth = firebase.auth,
    storage = firebase.storage().ref,
    configFirebase = config;
