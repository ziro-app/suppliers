import firebase from "firebase"

export interface ConfirmLinkResp {
  ok: boolean
  link?: string
}

export interface Default {
  ok: boolean
  msg?: string
}

export interface SendEmail {
  to: string
  customEmail: boolean
  confirmEmail: firebase.firestore.DocumentData
}

export interface UpdateUser {
  uid: string
  prop: firebase.firestore.DocumentData
}

export interface ChangeEmail {
  newEmail: string
  password: string
  collectionRef: firebase.firestore.CollectionReference
  continueUrl: string
  sheetId?: string
  sheetRange?: string
}

export interface SheetData {
  apiResource: string
  apiMethod: string
  range: string
  spreadsheetId: string
  resource: firebase.firestore.DocumentData
  valueInputOption: string
}

export interface UpdatePassword {
  oldPassword: string
  newPassword: string
}

export interface ResetPassword {
  email: string
}

export interface LogIn {
  email: string
  password: string
  userApp: string
}

export interface UpdateFirebaseDoc {
  collectionRef: firebase.firestore.CollectionReference
  collectionData: firebase.firestore.DocumentData
  field: string
  identifier: string
}

/** CreateUser types */

interface CreateUserCommonProps {
  collectionName: string
  collectionData: firebase.firestore.DocumentData
  continueUrl: string
  email: string
  password: string
}

interface CreateUserWithoutSheetsAndZoop extends CreateUserCommonProps {
  /** zoop fields */
  zoopUrl?: never
  zoopData?: never
  zoopResourceDeleteUrl?: never
  /** sheets fields */
  spreadsheetData?: never
  spreadsheetId?: never
  spreadsheetRange?: never
  idToSearch?: never
  rangeToSearch?: never
  rangeToUpdate?: never
  values?: never
}

interface CreateUserWithoutSheetsWithZoop extends CreateUserCommonProps {
  /** zoop fields */
  zoopUrl: string
  zoopData: firebase.firestore.DocumentData
  zoopResourceDeleteUrl: string
  /** sheets fields */
  spreadsheetData?: never
  spreadsheetId?: never
  spreadsheetRange?: never
  idToSearch?: never
  rangeToSearch?: never
  rangeToUpdate?: never
  values?: never
}

interface CreateUserWithSheetsWithoutZoop extends CreateUserCommonProps {
  /** zoop fields */
  zoopUrl?: never
  zoopData?: never
  zoopResourceDeleteUrl?: never
  /** sheets fields */
  spreadsheetData: string[]
  spreadsheetId: string
  spreadsheetRange: string
  idToSearch: string
  rangeToSearch: string
  rangeToUpdate: string
  values: string[]
}

interface CreateUserWithSheetsAndZoop extends CreateUserCommonProps {
  /** zoop fields */
  zoopUrl: string
  zoopData: firebase.firestore.DocumentData
  zoopResourceDeleteUrl: string
  /** sheets fields */
  spreadsheetData: string[]
  spreadsheetId: string
  spreadsheetRange: string
  idToSearch: string
  rangeToSearch: string
  rangeToUpdate: string
  values: string[]
}

export type CreateUser =
  | CreateUserWithoutSheetsAndZoop
  | CreateUserWithoutSheetsWithZoop
  | CreateUserWithSheetsWithoutZoop
  | CreateUserWithSheetsAndZoop

/** ConfirmLinkReq types */
interface ConfirmLinkWithEmail {
  type: "Email"
  email: string
  continueUrl: string
  uid?: never
}

interface ConfirmLinkWithCnpj {
  type: "CNPJ"
  email?: never
  continueUrl: string
  uid: string
}

export type ConfirmLinkReq = ConfirmLinkWithEmail | ConfirmLinkWithCnpj

/** DeleteAccount types */

interface DeleteAccountCommonProps {
  password: string
  collectionRef: firebase.firestore.CollectionReference
  sheetId?: string
  sheetRange?: string
}

interface DeleteAccountWithoutZoop extends DeleteAccountCommonProps {
  zoopId?: never
  zoopUrl?: never
}

interface DeleteAccountWithZoop extends DeleteAccountCommonProps {
  zoopId: string
  zoopUrl: string
}

export type DeleteAccount = DeleteAccountWithoutZoop | DeleteAccountWithZoop

/** RequestZoop types */

interface CreateZoop {
  url: string
  id?: never
  data: firebase.firestore.DocumentData
}

interface DeleteZoop {
  url: string
  id: string
  data?: never
}

export type RequestZoop = CreateZoop | DeleteZoop

export interface ReauthenticateData {
  email: string
  password: string
}
