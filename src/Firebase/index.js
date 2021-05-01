import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"
import { firebaseConfig } from "./firebase-config"
import { firebaseHomologConfig } from "./firebase-homolog-config"

const config = process.env.HOMOLOG ? firebaseHomologConfig : firebaseConfig

const init = firebase.initializeApp(config)

export const db = init.firestore()
export const auth = init.auth()
export const fs = firebase.firestore
export const fbauth = firebase.auth
export const storage = firebase.storage().ref()
export const configFirebase = config
