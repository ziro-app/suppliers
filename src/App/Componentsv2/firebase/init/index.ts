import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/performance"
import "firebase/auth"

import { firebaseConfig } from "./firebase-config"

firebase.initializeApp(firebaseConfig)

export { firebaseConfig }
export const db = firebase.firestore()
export const auth = firebase.auth()
export const perf = firebase.performance()
export const fs = firebase.firestore
export const fauth = firebase.auth
export const storage = firebase.storage().ref()
